const db = require("../config/db");

// Get all users
const getAllUsers = () => {
    return db("users").select("*");
};

// Get one user by ID
const getUserById = (id) => {
    return db("users").where({ id }).first();
};

// Get password record by username
const getPasswordByUsername = (username) => {
    return db("hashpwd").where({ username }).first();
};

// Add a user using a transaction
const createUser = async (user, passwordHash) => {
    return db.transaction(async (trx) => {
        const [newUser] = await trx("users")
            .insert(user)
            .returning("*");

        await trx("hashpwd").insert({
            username: user.username,
            password: passwordHash
        });

        return newUser;
    });
};

// Update user
const updateUser = (id, user) => {
    return db("users")
        .where({ id })
        .update(user)
        .returning("*");
};

module.exports = {
    getAllUsers,
    getUserById,
    getPasswordByUsername,
    createUser,
    updateUser
};

