const fs = require("fs");

function readFile(filename) {
    return fs.readFileSync(filename, "utf8");
}

function writeFile(filename, content) {
    fs.writeFileSync(filename, content);
}

module.exports = {
    readFile,
    writeFile
};