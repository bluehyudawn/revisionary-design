#!/usr/bin/env node
// Phase A2 — SPA 사이드바 네비게이션 기반 학생 전 화면 + 시험 리포트 상세 + Upcoming 카드 상호작용

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const BASE = 'http://web.dev.revision.internal';
const PASSWORD = '!q2w3e4r';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT = path.resolve(__dirname, '..', 'screenshots_v2', 'flow_student.1_B');
fs.mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let idx = 10;
async function cap(page, label) {
  await sleep(600);
  const file = path.join(OUT, `${idx++}_${label}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`  📸 ${path.basename(file)}  ${page.url()}`);
  return file;
}

async function clickSidebar(page, labelRegex) {
  return page.evaluate((regexSrc) => {
    const re = new RegExp(regexSrc, 'i');
    const all = Array.from(document.querySelectorAll('a, button, [role="link"], [role="button"], li, span, div'));
    const candidates = all.filter(el => {
      const t = (el.textContent || '').trim();
      if (!re.test(t) || t.length > 40) return false;
      const r = el.getBoundingClientRect();
      return r.left < 220 && r.width > 20 && r.height > 10 && r.height < 80;
    });
    candidates.sort((a, b) => {
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      return ra.height * ra.width - rb.height * rb.width; // smallest wins (most specific)
    });
    const target = candidates[0];
    if (target) { target.scrollIntoView({ block: 'center' }); target.click(); return { ok: true, text: (target.textContent || '').trim(), rect: target.getBoundingClientRect().toJSON() }; }
    return { ok: false, candidatesFound: candidates.length };
  }, labelRegex.source);
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
    console.log('▶ Phase A2 — student.1 sidebar flow');
    await page.goto(`${BASE}/signin`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('#email');
    await page.type('#email', 'student.1@revisiononline.com.au');
    await page.type('#password', PASSWORD);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 }).catch(() => {}),
      page.evaluate(() => {
        const b = Array.from(document.querySelectorAll('button, input[type="submit"]'));
        const s = b.find(x => /sign.?in|login/i.test(x.textContent || x.value || '')); (s || b[b.length - 1]).click();
      }),
    ]);
    await sleep(3500);
    await cap(page, 'dashboard');
    flow.push({ step: 'login', url: page.url() });

    // 1. Click "Opens in" upcoming card
    const upcoming = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('div, article'));
      const target = all.find(el => {
        const t = el.textContent || '';
        const r = el.getBoundingClientRect();
        return /Opens in /.test(t) && r.width > 150 && r.width < 500 && r.height > 100 && r.height < 400;
      });
      if (target) { target.click(); return { ok: true, snippet: target.textContent.slice(0, 150) }; }
      return { ok: false };
    });
    console.log('  Upcoming click:', upcoming);
    await sleep(2000);
    await cap(page, 'upcoming_click');
    flow.push({ step: 'upcoming-click', url: page.url(), ...upcoming });

    // 2. Navigate back to dashboard via sidebar
    await clickSidebar(page, /^Dashboard$/); await sleep(1500);

    // 3. Sidebar → Score Report
    const sr = await clickSidebar(page, /Score Report/); console.log('  Sidebar Score Report:', sr);
    await sleep(2000); await cap(page, 'score_report_list');
    flow.push({ step: 'sidebar-score-report', url: page.url(), ...sr });

    // 4. Click Report icon on first Completed row
    const reportClick = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tr'));
      for (const row of rows) {
        if (!/Completed/.test(row.textContent || '')) continue;
        const icon = row.querySelector('a, button, [role="link"], [role="button"], svg, img');
        if (icon) {
          const clickable = icon.closest('a, button, [role="link"], [role="button"]') || icon;
          clickable.scrollIntoView(); clickable.click();
          return { ok: true, row: row.textContent.slice(0, 120) };
        }
      }
      return { ok: false };
    });
    console.log('  Report icon click:', reportClick);
    await sleep(2500); await cap(page, 'score_report_detail');
    flow.push({ step: 'report-icon-click', url: page.url(), ...reportClick });

    // 5. Sidebar → Score Calculator
    await clickSidebar(page, /^Dashboard$/); await sleep(1000);
    const sc = await clickSidebar(page, /Score Calculator/); console.log('  Sidebar Score Calculator:', sc);
    await sleep(2000); await cap(page, 'score_calculator');
    flow.push({ step: 'sidebar-score-calc', url: page.url(), ...sc });

    // 6. Sidebar → Subjects
    const sub = await clickSidebar(page, /^Subjects$/); console.log('  Sidebar Subjects:', sub);
    await sleep(2000); await cap(page, 'subjects');
    flow.push({ step: 'sidebar-subjects', url: page.url(), ...sub });

    // 7. Sidebar → Payment
    const pay = await clickSidebar(page, /^Payment$/); console.log('  Sidebar Payment:', pay);
    await sleep(2000); await cap(page, 'payment');
    flow.push({ step: 'sidebar-payment', url: page.url(), ...pay });

    // 8. Sidebar → Profile
    const pr = await clickSidebar(page, /^Profile$/); console.log('  Sidebar Profile:', pr);
    await sleep(2000); await cap(page, 'profile');
    flow.push({ step: 'sidebar-profile', url: page.url(), ...pr });

    // 9. Sidebar → Notification
    const no = await clickSidebar(page, /^Notification/); console.log('  Sidebar Notification:', no);
    await sleep(2000); await cap(page, 'notification');
    flow.push({ step: 'sidebar-notification', url: page.url(), ...no });

    // 10. Sidebar → Instructions
    const ins = await clickSidebar(page, /^Instructions/); console.log('  Sidebar Instructions:', ins);
    await sleep(2000); await cap(page, 'instructions');
    flow.push({ step: 'sidebar-instructions', url: page.url(), ...ins });

    fs.writeFileSync(path.join(OUT, '_manifest.json'), JSON.stringify({ flow, events, capturedAt: new Date().toISOString() }, null, 2));
    console.log(`✓ Phase A2 done → ${OUT}`);
  } catch (err) {
    console.error(`✗ ${err.message}`);
  } finally {
    await browser.close();
  }
})();
