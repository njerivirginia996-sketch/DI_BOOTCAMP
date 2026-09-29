const express = require("express");
const bookRoutes = require("./routes/books");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/books", bookRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});