const { Pool } = require('pg');
const pool = new Pool({connectionString: process.env.DB})

async function findUser(email) {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return rows[0];
}

async function matchUser(id) {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return rows[0];
}

async function addUser(firstName, lastName, email, password) {
    await pool.query("INSERT INTO users (firstName, lastName, email, password) VALUES ($1, $2, $3, $4)", 
                        [firstName, lastName, email, password]);
}

module.exports = {
    findUser,
    matchUser,
    addUser
}