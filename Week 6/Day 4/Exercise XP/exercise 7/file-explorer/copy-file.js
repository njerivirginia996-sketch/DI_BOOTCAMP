const fs = require("fs");

fs.readFile("source.txt", "utf8", (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }

    fs.writeFile("destination.txt", data, err => {
        if (err) {
            console.error("Error writing file:", err);
            return;
        }

        console.log("File copied successfully!");
    });
});