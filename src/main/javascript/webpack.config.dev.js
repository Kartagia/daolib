const path = require('path');

module.exports = {
    mode: "development",
    entry: "./src/main/javascript/index.mjs",
    devtool: 'inline-source-map',
    output: {
        filename: "daolib.development.js",
        path: path.resolve(__dirname, "..", "..", "dist", "javascript")
    }
}