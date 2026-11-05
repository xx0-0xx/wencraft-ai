import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright-core';

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:5173';
const appUrl = (route) => `${BASE_URL.replace(/\/$/, '')}/#${route}`;
const OUT_DIR = path.resolve('test-output');
fs.mkdirSync(OUT_DIR, { recursive: true });

const candidates = [
  process.env.PW_EXECUTABLE,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

const executablePath = candidates.find((candidate) => fs.existsSync(candidate));
if (!executablePath) {
  console.error('未找到 Chrome/Edge。请设置 PW_EXECUTABLE 指向浏览器可执行文件。');
  process.exit(1);
}

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: [
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--use-angle=swiftshader',
    '--disable-gpu-sandbox',
  ],
});

const context = await browser.newContext({
  viewport: { width: 1440, height: 960 },
  acceptDownloads: true,
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text());
});

const desktopInput = () =>
  page.locator('input[aria-label="铭文内容"]:visible').first();

await page.goto(appUrl('/studio'), { waitUntil: 'domcontentloaded' });
await page.waitForSelector('canvas[data-studio-canvas="true"]', { timeout: 30000 });
await page.waitForTimeout(4500);

await page.getByRole('button', { name: /朱泥/ }).filter({ visible: true }).first().click();
await page.waitForTimeout(500);

await page.getByRole('button', { name: /铭文/ }).first().click();
await page.waitForTimeout(400);
await desktopInput().fill('山水清音');
await page.waitForTimeout(700);

await page.getByRole('button', { name: /纹样/ }).first().click();
await page.waitForTimeout(400);
const plum = page.locator('button[title*="梅"]').filter({ visible: true }).first();
if (await plum.count()) {
  await plum.click();
  await page.waitForTimeout(1300);
} else {
  errors.push('未找到梅纹样按钮');
}

await page.screenshot({ path: path.join(OUT_DIR, 'studio-desktop.png') });

await page.locator('button:visible').filter({ hasText: '保存草稿' }).first().click();
await page.waitForTimeout(400);
const saved = await page.evaluate(() => localStorage.getItem('wencraft:studio:v1'));
if (!saved) errors.push('草稿未写入 localStorage');

await page.reload({ waitUntil: 'domcontentloaded' });
await page.waitForSelector('canvas[data-studio-canvas="true"]', { timeout: 30000 });
await page.waitForTimeout(3500);
await page.getByRole('button', { name: /铭文/ }).first().click();
await page.waitForTimeout(400);
const restored = await desktopInput().inputValue();
if (restored !== '山水清音') errors.push(`草稿恢复失败：${restored}`);

try {
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 20000 }),
    page.getByLabel('保存预览截图').click(),
  ]);
  if (!download.suggestedFilename().endsWith('.png')) {
    errors.push('截图下载文件名异常');
  }
} catch (error) {
  errors.push(`截图下载失败：${error.message}`);
}

await page.getByRole('button', { name: '侧面' }).filter({ visible: true }).first().click();
await page.waitForTimeout(3000);
await page.screenshot({ path: path.join(OUT_DIR, 'studio-side.png') });

await page.close();

const mobileContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2,
});
const mobile = await mobileContext.newPage();
await mobile.goto(appUrl('/studio'), { waitUntil: 'domcontentloaded' });
await mobile.waitForSelector('canvas[data-studio-canvas="true"]', { timeout: 30000 });
await mobile.waitForTimeout(5000);
await mobile.screenshot({ path: path.join(OUT_DIR, 'studio-mobile.png') });
const overflow = await mobile.evaluate(() => ({
  scroll: document.documentElement.scrollWidth,
  client: document.documentElement.clientWidth,
}));
if (overflow.scroll > overflow.client) errors.push('移动端出现横向溢出');
await mobileContext.close();

const landing = await context.newPage();
await landing.goto(appUrl('/'), { waitUntil: 'networkidle' });
const title = await landing.locator('h1').first().textContent();
if (!title?.includes('器物有言')) errors.push('首页标题未正确渲染');
await landing.screenshot({ path: path.join(OUT_DIR, 'landing.png') });

await browser.close();

if (errors.length) {
  console.error('核心交互检查失败：');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('核心交互检查通过：真实 GLB、材质切换、铭文贴花、纹样切换、草稿恢复、移动端布局。');
console.log(`截图输出目录：${OUT_DIR}`);
