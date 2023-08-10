module.exports = {
  resolve: {
    extensions: [".ts", ".js"],
  },
  entry: "./electron/main.ts",
  module: {
    rules: require("./rules.webpack"),
  },
  externals: {
    puppeteer: 'puppeteer',
    'puppeteer-extra': 'puppeteer-extra',
    'puppeteer-extra-plugin-stealth': 'puppeteer-extra-plugin-stealth',
    'sharp': 'sharp',
    'puppeteer-extra-plugin-minmax': 'puppeteer-extra-plugin-minmax',
    'chromium': 'chromium',
    'steam-session': 'steam-session',
    'steamcommunity': 'steamcommunity'
  },
};
