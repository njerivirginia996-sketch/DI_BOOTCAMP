const express = require("express");
const router = require("./routes/index");

const app = express();
const PORT = 3000;

app.use("/", router);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});