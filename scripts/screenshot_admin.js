import puppeteer from 'puppeteer';

(async function () {
  const url = process.env.DEV_URL || 'http://localhost:5174';
  const out = '/tmp/admin.png';
  const logFile = '/tmp/admin_browser.log';
  console.log('opening', url);
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    // capture console messages
    const fs = await import('fs');
    page.on('console', (msg) => {
      try {
        fs.appendFileSync(logFile, `[console] ${msg.type()} ${msg.text()}\n`);
      } catch (e) {}
    });
    page.on('pageerror', (err) => {
      try {
        fs.appendFileSync(logFile, `[pageerror] ${err.message}\n`);
      } catch (e) {}
    });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    // try several ways to click the Admin button
    await page.waitForSelector('button', { timeout: 8000 });
    const adminLabels = ['admin', 'administrador', 'dashboard'];
    let clicked = false;
    const buttons = await page.$$('button');
    for (const b of buttons) {
      const txt = ((await page.evaluate((el) => el.textContent, b)) || '')
        .trim()
        .toLowerCase();
      for (const lbl of adminLabels)
        if (txt.includes(lbl)) {
          await b.click();
          clicked = true;
          break;
        }
      if (clicked) break;
    }
    if (!clicked) {
      // try links
      const links = await page.$$('a');
      for (const a of links) {
        const txt = ((await page.evaluate((el) => el.textContent, a)) || '')
          .trim()
          .toLowerCase();
        if (txt.includes('admin')) {
          await a.click();
          clicked = true;
          break;
        }
      }
    }

    // wait for dashboard heading or totals block
    try {
      await page.waitForXPath(
        "//h2[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'admin') or contains(., 'Dashboard') or //div[contains(@class,'admin-totals')]]",
        { timeout: 15000 }
      );
    } catch (e) {
      /* continue to screenshot anyway */
    }

    await page.screenshot({ path: out, fullPage: true });
    console.log('screenshot saved to', out);
  } catch (e) {
    console.error('error', e && e.message ? e.message : e);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
})();
