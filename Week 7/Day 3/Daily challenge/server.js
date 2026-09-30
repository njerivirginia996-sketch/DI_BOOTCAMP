const express = require("express");
const path = require("path");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", userRoutes);
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));
app.use((error, req, res, next) => {
    const status = error.status || 500;
    if (status === 500) console.error(error);
    res.status(status).json({ error: status === 500 ? "A server error occurred." : error.message });
});

if (require.main === module) {
    app.listen(PORT, () => console.log(`User management app running at http://localhost:${PORT}`));
}

module.exports = app;
