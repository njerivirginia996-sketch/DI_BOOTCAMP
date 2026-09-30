const express = require("express");

const userRoutes = require("./server/routes/userRoutes");

const app = express();

const PORT = 5000;

// Middleware
app.use(express.json());

// Routes
app.use("/", userRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`User API running at http://localhost:${PORT}`);
});

