#!/usr/bin/env node
// v2 capture — modal skip + performance metrics + console errors + failed requests
// + explicit URL routing (depth-2) per role.
// Usage: node capture_v2.js <role> <username>

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const BASE = 'http://web.dev.revision.internal';
const PASSWORD = '!q2w3e4r';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT_ROOT = path.resolve(__dirname, '..', 'screenshots_v2');

const ROLE_ROUTES = {
  writer: [
    '/dashboard',
    '/writer/exam/create-exam',
    '/writer/my-exams',
    '/writer/question-bank',
    '/profile',
    '/notification',
    '/instructions',
  ],
  teacher: [
    '/dashboard',
    '/teacher/class',
    '/teacher/exam/create',
    '/teacher/question-bank',
    '/teacher/marking',
    '/teacher/my-exams',
    '/profile',
    '/notification',
    '/instructions',
  ],
  student: [
    '/dashboard',
    '/student/subjects',
    '/score-report',
    '/student/score-calculator',
    '/payment-management',
    '/profile',
    '/notification',
    '/instructions',
  ],
  manager: [
    '/dashboard',
    '/teacher/exam/create',
    '/manager/question-bank',
    '/manager/my-exams',
    '/manager/mock-exam-sequence',
    '/manager/mock-exam-list',
    '/manager/practice-exam-list',
    '/manager/writer-question-list',
    '/manager/user',
    '/manager/school',
    '/manager/inquiry',
    '/manager/question-category',
    '/manager/subjects',
    '/profile',
    '/notification',
    '/instructions',
  ],
};

const [, , role, username] = process.argv;
if (!role || !username) {
  console.error('Usage: node capture_v2.js <role> <username>');
  process.exit(1);
}
if (!ROLE_ROUTES[role]) {
  console.error(`Unknown role: ${role}. Known: ${Object.keys(ROLE_ROUTES).join(', ')}`);
  process.exit(1);
}

const email = `${username}@revisiononline.com.au`;
const outDir = path.join(OUT_ROOT, `${role}_${username}`);
fs.mkdirSync(outDir, { recursive: true });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const safeName = (s) => s.replace(/[^a-zA-Z0-9]/g, '_').replace(/^_+|_+$/g, '').slice(0, 50) || 'root';

async function cap(page, name) {
  await sleep(300);
  const file = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  const size = fs.statSync(file).size;
  console.log(`  📸 ${name}.png  ${page.url()}  (${size}B)`);
  return { file, size, url: page.url() };
}

async function skipModal(page) {
  try {
    const skipped = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button, [role="button"], a'));
      const skip = btns.find(b => /skip.?tutorial|skip/i.test((b.textContent || '').trim()));
      if (skip) { skip.click(); return 'skip'; }
      const close = Array.from(document.querySelectorAll('button[aria-label*="close" i], [data-testid*="close" i]'))[0];
      if (close) { close.click(); return 'close'; }
      return false;
    });
    if (skipped) { console.log(`  ▶ modal skipped via ${skipped}`); await sleep(900); return true; }
  } catch {}
  return false;
}

async function collectMetrics(page) {
  try {
    return await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const paints = performance.getEntriesByType('paint');
      const fp = paints.find(p => p.name === 'first-paint');
      const fcp = paints.find(p => p.name === 'first-contentful-paint');
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint') || [];
      const lcp = lcpEntries[lcpEntries.length - 1];
      if (!nav) return null;
      return {
        ttfb: Math.round(nav.responseStart - nav.requestStart),
        domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
        loadEvent: Math.round(nav.loadEventEnd - nav.startTime),
        firstPaint: fp ? Math.round(fp.startTime) : null,
        firstContentfulPaint: fcp ? Math.round(fcp.startTime) : null,
        largestContentfulPaint: lcp ? Math.round(lcp.renderTime || lcp.loadTime || lcp.startTime) : null,
        transferSize: nav.transferSize,
      };
    });
  } catch { return null; }
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

  const consoleErrors = [];
  const failedRequests = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push({ url: page.url(), text: msg.text().slice(0, 300) });
  });
  page.on('pageerror', (err) => pageErrors.push({ url: page.url(), message: err.message.slice(0, 300) }));
  page.on('requestfailed', (req) => {
    failedRequests.push({ url: req.url().slice(0, 200), method: req.method(), failure: req.failure()?.errorText, pageUrl: page.url() });
  });

  const results = [];
  try {
    console.log(`\n▶ ${role}/${username} (${email})`);

    // Sign in via existing flow
    await page.goto(`${BASE}/signin`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('#email');
    await page.type('#email', email, { delay: 10 });
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

    if (page.url().includes('/signin')) {
      console.log('  ✗ login failed');
      fs.writeFileSync(path.join(outDir, '_manifest.json'), JSON.stringify({ role, username, error: 'login failed' }, null, 2));
      return;
    }

    console.log(`  post-login: ${page.url()}`);

    // Visit each hard-coded route twice:
    //  (1) as-is — so we can capture any first-render issues (modal, onboarding)
    //  (2) modal-dismissed — so we can see the actual page
    const routes = ROLE_ROUTES[role];
    let idx = 10;
    for (const route of routes) {
      const url = `${BASE}${route}`;
      const safe = safeName(route);
      console.log(`  → ${route}`);
      try {
        const navStart = Date.now();
        const resp = await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 }).catch(e => ({ error: e.message }));
        const navMs = Date.now() - navStart;
        await sleep(1500);

        const beforeShot = await cap(page, `${idx}_${safe}_raw`);
        const modalSkipped = await skipModal(page);
        let afterShot = null;
        if (modalSkipped) {
          await sleep(1200);
          afterShot = await cap(page, `${idx}_${safe}_clean`);
        }

        const metrics = await collectMetrics(page);

        results.push({
          targetRoute: route,
          landedUrl: page.url(),
          redirected: !page.url().endsWith(route),
          navMs,
          httpStatus: resp && resp.status ? resp.status() : null,
          modalAppeared: modalSkipped,
          metrics,
          beforeShot: beforeShot?.file,
          afterShot: afterShot?.file,
          error: resp?.error || null,
        });

        idx++;
      } catch (e) {
        console.log(`  ! ${route} failed: ${e.message}`);
        results.push({ targetRoute: route, error: e.message });
      }
    }

    fs.writeFileSync(
      path.join(outDir, '_manifest.json'),
      JSON.stringify({
        role, username, email,
        capturedAt: new Date().toISOString(),
        viewport: { width: 1440, height: 900 },
        routes: results,
        consoleErrors,
        pageErrors,
        failedRequests,
      }, null, 2)
    );
    console.log(`✓ done: ${outDir}  (${results.length} routes · ${consoleErrors.length} console errors · ${failedRequests.length} failed req · ${pageErrors.length} page errors)`);
  } catch (err) {
    console.error(`✗ ${username}: ${err.message}`);
    console.error(err.stack);
  } finally {
    await browser.close();
  }
})();
