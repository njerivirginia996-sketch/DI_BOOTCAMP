const express = require("express");

const router = express.Router();

const {
    register,
    login,
    getUsers,
    getUser,
    updateUser
} = require("../controllers/userController");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Get all users
router.get("/users", getUsers);

// Get one user
router.get("/users/:id", getUser);

// Update user
router.put("/users/:id", updateUser);

module.exports = router;
