const path = require('path');

// Always use a stable path inside the repo so browsers survive sandbox/agent runs.
process.env.PLAYWRIGHT_BROWSERS_PATH = path.resolve(__dirname, '../.playwright-browsers');

module.exports = process.env.PLAYWRIGHT_BROWSERS_PATH;
