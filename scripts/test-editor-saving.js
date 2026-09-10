const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const page = await browser.newPage();
    await page.goto((process.env.EDITOR_TEST_URL || 'http://127.0.0.1:4182') + '/villages-without-wells?section=6');
    const editor = page.locator('#coding-editor');
    await editor.fill('function countWellsToDig(){return 1;}');
    await page.evaluate(() => { window.originalSave = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('Storage is full', 'QuotaExceededError'); }; });
    await editor.press('End');
    await editor.pressSequentially('// valuable new work');
    assert.equal(await page.locator('#coding-save-warning').isVisible(), true);
    assert.match(await page.locator('#coding-save-warning').innerText(), /Copy it before leaving/);
    await page.screenshot({ path: 'tmp/editor-audit/save-warning.png', fullPage: true });
    await page.evaluate(() => { Storage.prototype.setItem = window.originalSave; });
    await editor.pressSequentially('!');
    assert.equal(await page.locator('#coding-save-warning').isVisible(), false);
    const saved = await editor.inputValue();
    await page.reload();
    assert.equal(await editor.inputValue(), saved);
    for (const [index, value] of ['3', '[true]', '[]'].entries()) await page.locator('#coding-input-' + index).fill(value);
    await page.locator('#coding-run').click();
    assert.match(await page.locator('#coding-results').innerText(), /paths needs valid/);
    assert.equal(await page.locator('#coding-input-1').evaluate(el => document.activeElement === el), true);
    await page.close();
    console.log('Storage failure warning, recovery, reload, and invalid-field focus passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
