const path = require('path');

module.exports = {
    mode: "production",
    entry: "./src/main/javascript/index.mjs",
    output: {
        filename: "daolib.production.js",
        path: path.resolve(__dirname, "dist", "javascript")
    }
}