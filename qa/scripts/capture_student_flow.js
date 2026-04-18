#!/usr/bin/env node
// Phase A — student.1 로 기존 Completed 시험 카드 클릭 → Score Report 플로우 캡처
// 데이터 생성 없음. 읽기 전용.

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const BASE = 'http://web.dev.revision.internal';
const PASSWORD = '!q2w3e4r';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT = path.resolve(__dirname, '..', 'screenshots_v2', 'flow_student.1_A');
fs.mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let shotIdx = 10;
async function cap(page, label) {
  await sleep(400);
  const file = path.join(OUT, `${shotIdx++}_${label}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`  📸 ${path.basename(file)}  ${page.url()}`);
  return file;
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(20000);

  const events = { console: [], errors: [], failed: [] };
  page.on('console', m => { if (m.type() === 'error') events.console.push({ url: page.url(), text: m.text().slice(0, 300) }); });
  page.on('pageerror', e => events.errors.push({ url: page.url(), msg: e.message.slice(0, 300) }));
  page.on('requestfailed', r => events.failed.push({ url: r.url().slice(0, 200), err: r.failure()?.errorText }));

  const flow = [];
  try {
    console.log('▶ Phase A — student.1 flow');
    await page.goto(`${BASE}/signin`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('#email');
    await page.type('#email', 'student.1@revisiononline.com.au', { delay: 10 });
    await page.type('#password', PASSWORD, { delay: 10 });
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 }).catch(() => {}),
      page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button, input[type="submit"]'));
        const submit = btns.find(b => /sign.?in|login|log.?in/i.test(b.textContent || b.value || ''));
        (submit || btns[btns.length - 1]).click();
      }),
    ]);
    await sleep(3500);
    await cap(page, 'dashboard_initial');
    flow.push({ step: 'login', url: page.url() });

    // 1. Find Completed exam cards
    const cards = await page.evaluate(() => {
      const results = [];
      document.querySelectorAll('*').forEach(el => {
        const t = el.textContent || '';
        if (/Completed/.test(t) && el.children.length < 20 && t.length < 600) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 100 && rect.width < 500 && rect.height > 80) {
            results.push({ top: rect.top, left: rect.left, w: rect.width, h: rect.height, snippet: t.slice(0, 80) });
          }
        }
      });
      return results.slice(0, 20);
    });
    console.log(`  Completed 후보 ${cards.length}개`);
    flow.push({ step: 'find-completed', count: cards.length, sample: cards.slice(0, 3) });

    // 2. Click first Completed card
    const clickedCompleted = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('div, article, a, button'));
      const target = cards.find(el => {
        const t = el.textContent || '';
        const r = el.getBoundingClientRect();
        return /Completed/.test(t) && r.width > 150 && r.width < 500 && r.height > 100 && r.height < 400 && t.length < 400;
      });
      if (target) {
        target.scrollIntoView();
        target.click();
        return { clicked: true, snippet: target.textContent.slice(0, 100) };
      }
      return { clicked: false };
    });
    console.log('  Completed 클릭:', clickedCompleted);
    await sleep(2500);
    await cap(page, 'completed_click_result');
    flow.push({ step: 'click-completed', url: page.url(), ...clickedCompleted });

    // 3. Navigate to /score-report list
    await page.goto(`${BASE}/score-report`, { waitUntil: 'networkidle2' }).catch(() => {});
    await sleep(2000);
    await cap(page, 'score_report_list');
    flow.push({ step: 'score-report-list', url: page.url() });

    // 4. Click first score report row
    const clickedRow = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tr, [role="row"], a[href*="score-report"], button'));
      const detail = rows.find(el => {
        const t = el.textContent || '';
        const r = el.getBoundingClientRect();
        return /view|detail|report/i.test(t) && r.width > 50 && r.height > 20;
      });
      if (detail) {
        detail.scrollIntoView();
        detail.click();
        return { clicked: true, snippet: detail.textContent.slice(0, 80) };
      }
      return { clicked: false };
    });
    console.log('  Score Report 상세:', clickedRow);
    await sleep(2500);
    await cap(page, 'score_report_detail');
    flow.push({ step: 'score-report-detail', url: page.url(), ...clickedRow });

    // 5. Student Subjects click → Mock Exam Periods
    await page.goto(`${BASE}/student/subjects`, { waitUntil: 'networkidle2' }).catch(() => {});
    await sleep(2000);
    await cap(page, 'subjects');
    flow.push({ step: 'subjects', url: page.url() });

    // 6. Go back to dashboard + find "Opens in" upcoming card
    await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle2' }).catch(() => {});
    await sleep(2000);
    const upcoming = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('div'));
      const target = els.find(el => /Opens in /.test(el.textContent || ''));
      if (target) {
        target.scrollIntoView();
        target.click();
        return { found: true, text: target.textContent.slice(0, 150) };
      }
      return { found: false };
    });
    console.log('  Upcoming 카드:', upcoming);
    await sleep(2500);
    await cap(page, 'upcoming_click_result');
    flow.push({ step: 'upcoming-click', url: page.url(), ...upcoming });

    fs.writeFileSync(path.join(OUT, '_manifest.json'), JSON.stringify({
      flow, events, capturedAt: new Date().toISOString(),
    }, null, 2));
    console.log(`✓ Phase A done → ${OUT}`);
  } catch (err) {
    console.error(`✗ ${err.message}`);
    console.error(err.stack);
  } finally {
    await browser.close();
  }
})();
