const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  resolve: {
    fallback: {
      "react/jsx-runtime": "react/jsx-runtime.js",
      "react/jsx-dev-runtime": "react/jsx-dev-runtime.js",
      "crypto": require.resolve("crypto-browserify"),
      "https": false
    },
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: require("./rules.webpack"),
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "./assets", to: "./assets" }]
    })
  ],
};
