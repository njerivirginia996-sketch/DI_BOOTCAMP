const express = require("express");
const path = require("path");
const api = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", api);

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Strategy game running at http://localhost:${PORT}`);
    });
}

module.exports = app;
