require('dotenv').config();
const { Pool } = require('pg');

const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
};

// Only add the password property if it's actually provided
if (process.env.DB_PASSWORD) {
  dbConfig.password = process.env.DB_PASSWORD;
}

const pool = new Pool(dbConfig);

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: async () => {
    const client = await pool.connect();
    return client;
  },
};