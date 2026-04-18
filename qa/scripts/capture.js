#!/usr/bin/env node
// Login to RevisionOnline DEV and capture screenshots for a given account.
// Uses click-based navigation (client-side routing) after login.
// Usage: node capture.js <role> <username>

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const BASE = 'http://web.dev.revision.internal';
const PASSWORD = '!q2w3e4r';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT_ROOT = path.resolve(__dirname, '..', 'screenshots');

const [, , role, username] = process.argv;
if (!role || !username) {
  console.error('Usage: node capture.js <role> <username>');
  process.exit(1);
}

const email = `${username}@revisiononline.com.au`;
const outDir = path.join(OUT_ROOT, `${role}_${username}`);
fs.mkdirSync(outDir, { recursive: true });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function cap(page, name) {
  await sleep(400);
  const file = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  const size = fs.statSync(file).size;
  console.log(`  📸 ${name}.png  ${page.url()}  (${size} bytes)`);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);

  try {
    console.log(`\n▶ ${role}/${username}  (${email})`);

    // 1. Landing
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 20000 });
    await cap(page, '00_landing');

    // 2. Signin page
    await page.goto(`${BASE}/signin`, { waitUntil: 'networkidle2', timeout: 20000 });
    await page.waitForSelector('#email', { timeout: 8000 });
    await cap(page, '01_signin');

    // 3. Fill and submit
    await page.type('#email', email, { delay: 15 });
    await page.type('#password', PASSWORD, { delay: 15 });

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 }).catch(() => {}),
      page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button, input[type="submit"]'));
        const submit = btns.find(b => /sign.?in|login|log.?in/i.test(b.textContent || b.value || ''));
        (submit || btns[btns.length - 1]).click();
      }),
    ]);
    await sleep(3000);
    await cap(page, '02_post_login');
    const postUrl = page.url();
    console.log(`  post-login url: ${postUrl}`);

    if (postUrl.includes('/signin')) {
      console.log('  ✗ login failed — still on /signin');
      fs.writeFileSync(
        path.join(outDir, '_manifest.json'),
        JSON.stringify({ role, username, email, postUrl, error: 'login failed' }, null, 2)
      );
      return;
    }

    // 4. Harvest nav links (collect href + visible text so we can click by text)
    const links = await page.evaluate(() => {
      const seen = new Set();
      const out = [];
      document.querySelectorAll('a[href], [role="link"]').forEach(a => {
        const h = a.getAttribute('href') || '';
        const t = (a.textContent || '').trim();
        if (!h.startsWith('/')) return;
        if (/signin|signup|signout|logout|forgot|register-student|_next|api\//i.test(h)) return;
        if (!t) return;
        if (seen.has(h)) return;
        seen.add(h);
        out.push({ href: h, text: t.slice(0, 60) });
      });
      return out;
    });
    console.log(`  found ${links.length} nav links: ${links.map(l => l.text).join(', ')}`);

    // 5. Click each nav link (client-side routing)
    let idx = 10;
    for (const { href, text } of links) {
      const safe = href.replace(/[^a-zA-Z0-9]/g, '_').replace(/^_+|_+$/g, '').slice(0, 40) || 'root';
      try {
        const clicked = await page.evaluate((txt) => {
          const el = Array.from(document.querySelectorAll('a, [role="link"]'))
            .find(a => (a.textContent || '').trim() === txt);
          if (!el) return false;
          el.click();
          return true;
        }, text);
        if (!clicked) { console.log(`  - skip ${text} (not found)`); continue; }
        await sleep(2500);
        if (page.url().includes('/signin')) {
          console.log(`  ✗ bounced to signin after clicking ${text}`);
          break;
        }
        await cap(page, `${idx}_${safe}`);
        idx++;
      } catch (e) {
        console.log(`  ! click ${text} failed: ${e.message}`);
      }
    }

    // 6. Sidebar/drawer toggle — some dashboards have a menu button
    try {
      const toggled = await page.evaluate(() => {
        const btn = document.querySelector('button[aria-label*="menu" i], button[aria-label*="toggle" i]');
        if (btn) { btn.click(); return true; }
        return false;
      });
      if (toggled) {
        await sleep(800);
        await cap(page, `${idx++}_menu_open`);
      }
    } catch {}

    fs.writeFileSync(
      path.join(outDir, '_manifest.json'),
      JSON.stringify({ role, username, email, postUrl, links }, null, 2)
    );
    console.log(`✓ done: ${outDir}`);
  } catch (err) {
    console.error(`✗ ${username}:`, err.message);
    console.error(err.stack);
  } finally {
    await browser.close();
  }
})();
