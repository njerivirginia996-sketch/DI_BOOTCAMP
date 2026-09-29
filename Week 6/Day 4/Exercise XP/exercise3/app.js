const { readFile, writeFile } = require("./fileManager");

const content = readFile("Hello World.txt");

console.log("Content of Hello World.txt:");
console.log(content);

writeFile("Bye World.txt", "Writing to the file");

console.log("Bye World.txt has been updated.");