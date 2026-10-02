const fs = require('node:fs');
const path = require('node:path');
const knex = require('knex');
const { development } = require('../../knexfile');

fs.mkdirSync(path.dirname(development.connection.filename), { recursive: true });

module.exports = knex(development);