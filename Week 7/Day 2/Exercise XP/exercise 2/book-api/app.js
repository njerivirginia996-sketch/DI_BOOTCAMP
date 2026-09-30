const express = require("express");

const bookRoutes = require("./server/routes/bookRoutes");

const app = express();

const PORT = 5000;

// Middleware
app.use(express.json());

// Routes
app.use("/api", bookRoutes);

// 404 error
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Server
app.listen(PORT, () => {
    console.log(`Book API running at http://localhost:${PORT}`);
});

