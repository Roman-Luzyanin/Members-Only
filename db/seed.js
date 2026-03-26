require('dotenv').config();
const { Client } = require('pg');

const SQL = `
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        isMember BOOLEAN DEFAULT FALSE
    );
`;

async function seed() {
    const client = new Client({ connectionString: process.env.DB });
        
    await client.connect();
    await client.query(SQL);
    await client.end();
}

seed();