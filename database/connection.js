const { createPool } = require('mysql2');

const database = "movies_app";
const databasePool = createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: database,
    connectionLimit: 10,
    multipleStatements: true
});

module.exports = databasePool;