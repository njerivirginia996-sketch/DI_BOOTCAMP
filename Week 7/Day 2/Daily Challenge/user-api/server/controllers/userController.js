const bcrypt = require("bcrypt");

const userModel = require("../models/userModel");

// POST /register
const register = async (req, res) => {
    try {
        const {
            email,
            username,
            first_name,
            last_name,
            password
        } = req.body;

        // Check required fields
        if (!email || !username || !first_name || !last_name || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user using a transaction
        const newUser = await userModel.createUser(
            {
                email,
                username,
                first_name,
                last_name
            },
            passwordHash
        );

        res.status(201).json({
            message: "User registered successfully",
            user: newUser
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to register user"
        });
    }
};

// POST /login
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        // Find the stored password hash
        const userPassword = await userModel.getPasswordByUsername(username);

        if (!userPassword) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        // Compare password with bcrypt hash
        const passwordMatch = await bcrypt.compare(
            password,
            userPassword.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        res.json({
            message: "Login successful"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to login"
        });
    }
};

// GET /users
const getUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();

        res.json(users);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get users"
        });
    }
};

// GET /users/:id
const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel.getUserById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get user"
        });
    }
};

// PUT /users/:id
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            email,
            username,
            first_name,
            last_name
        } = req.body;

        const [updatedUser] = await userModel.updateUser(id, {
            email,
            username,
            first_name,
            last_name
        });

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update user"
        });
    }
};

module.exports = {
    register,
    login,
    getUsers,
    getUser,
    updateUser
};

