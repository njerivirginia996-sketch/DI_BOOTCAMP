const express = require("express");
const todoRoutes = require("./routes/todos");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/todos", todoRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});