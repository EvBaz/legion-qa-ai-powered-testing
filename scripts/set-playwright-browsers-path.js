const os = require('os');
const path = require('path');

// Always use a stable path inside the repo so browsers survive sandbox/agent runs.
process.env.PLAYWRIGHT_BROWSERS_PATH = path.resolve(__dirname, '../.playwright-browsers');

// Cursor/sandbox runs often expose an empty os.cpus() list, so Playwright falls back to
// mac-x64 binaries on Apple Silicon. Force the arm64 host platform when Node reports arm64.
if (
  process.platform === 'darwin' &&
  process.arch === 'arm64' &&
  !process.env.PLAYWRIGHT_HOST_PLATFORM_OVERRIDE
) {
  const [major] = os.release().split('.').map((part) => parseInt(part, 10));
  const lastStableMacOsMajorVersion = 26;
  let macVersion;

  if (major < 25) {
    macVersion = `mac${major - 9}`;
  } else {
    macVersion = `mac${Math.min(major + 1, lastStableMacOsMajorVersion)}`;
  }

  process.env.PLAYWRIGHT_HOST_PLATFORM_OVERRIDE = `${macVersion}-arm64`;
}

module.exports = process.env.PLAYWRIGHT_BROWSERS_PATH;
