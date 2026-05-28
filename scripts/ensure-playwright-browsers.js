const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const browsersPath = require('./set-playwright-browsers-path');

function browsersAreInstalled() {
  if (!fs.existsSync(browsersPath)) {
    return false;
  }
  return fs.readdirSync(browsersPath).some((name) => name.startsWith('chromium-'));
}

if (process.env.SKIP_PLAYWRIGHT_BROWSER_INSTALL === '1') {
  process.exit(0);
}

if (browsersAreInstalled()) {
  console.log(`Playwright browsers already installed at ${browsersPath}`);
  process.exit(0);
}

console.log(`Installing Playwright browsers to ${browsersPath}...`);
fs.mkdirSync(browsersPath, { recursive: true });

execSync('npx playwright install chromium', {
  stdio: 'inherit',
  env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: browsersPath },
});

console.log('Playwright browsers installed.');
