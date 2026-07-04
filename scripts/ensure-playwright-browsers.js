const { execSync } = require('child_process');
const fs = require('fs');

const browsersPath = require('./set-playwright-browsers-path');

function chromiumExecutableExists() {
  try {
    const { chromium } = require('playwright');
    return fs.existsSync(chromium.executablePath());
  } catch {
    return false;
  }
}

if (process.env.SKIP_PLAYWRIGHT_BROWSER_INSTALL === '1') {
  process.exit(0);
}

if (chromiumExecutableExists()) {
  console.log(`Playwright browsers already installed at ${browsersPath}`);
  process.exit(0);
}

console.log(`Installing Playwright browsers to ${browsersPath}...`);
fs.mkdirSync(browsersPath, { recursive: true });

execSync('npx playwright install chromium', {
  stdio: 'inherit',
  env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: browsersPath },
});

if (!chromiumExecutableExists()) {
  console.error('Playwright browser install finished but the Chromium executable is still missing.');
  process.exit(1);
}

console.log('Playwright browsers installed.');
