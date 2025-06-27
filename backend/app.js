const express = require('express');
const { Pool } = require('pg');

const app = express();

const pool = new Pool({
  user: 'postgres',
  host: process.env.DB_HOST,
  database: 'postgres',
  password: process.env.DB_PASSWORD,
  port: 5432,
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/status', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    console.log('Successfully connected to the database!');
    res.status(200).json({ status: 'ok', message: 'Database connection successful!' });
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to connect to database.' });
  } finally {
    if (client) {
      client.release();
    }
  }
});

module.exports = app;