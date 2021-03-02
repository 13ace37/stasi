const { join: j } = require("path");
const Stasi = require(j(__dirname, "src/Stasi"));

new Stasi(process.argv.slice(2)[0] || false, require(j(__dirname, "settings")));