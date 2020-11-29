const path = require("path");
const PACKAGE = require('./package.json');

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: PACKAGE.name + ".min.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    alias: {
      vm: "vm-browserify"
    }
  }
};
