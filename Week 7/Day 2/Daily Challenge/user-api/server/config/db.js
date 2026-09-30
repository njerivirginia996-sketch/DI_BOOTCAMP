const knex = require("knex");

const db = knex({
    client: "pg",
    connection: {
        host: "localhost",
        port: 5432,
        user: "postgres",
        password: process.env.DB_PASSWORD,
        database: "userdb"
    }
});

module.exports = db;

