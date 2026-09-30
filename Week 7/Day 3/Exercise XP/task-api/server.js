const express = require("express");
const tasksRouter = require("./routes/tasks");

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON request bodies
app.use(express.json());

// Mount the tasks router
app.use("/tasks", tasksRouter);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// Central error handler
app.use((err, req, res, next) => {
  // Malformed JSON in request body
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }

  console.error(err);
  res.status(err.status || 500).json({
    error: err.publicMessage || "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Task API running on http://localhost:${PORT}`);
});
