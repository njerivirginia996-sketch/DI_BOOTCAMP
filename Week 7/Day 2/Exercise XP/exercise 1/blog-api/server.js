const express = require("express");

const postRoutes = require("./server/routes/postRoutes");

const app = express();

const PORT = 3000;

app.use(express.json());

app.use("/api", postRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        message: "Internal server error"
    });
});

app.listen(PORT, () => {
    console.log(`Blog API running at http://localhost:${PORT}`);
});