import fs from "fs";

export function readFile() {
    const content = fs.readFileSync("./files/file-data.txt", "utf8");

    console.log("File content:");
    console.log(content);
}