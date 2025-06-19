const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// config for db read from environment variable (terraform)
const pool = new Pool({
  user: 'postgres', 
  host: process.env.DB_HOST,
  database: 'postgres', 
  password: process.env.DB_PASSWORD,
  port: 5432,
});

app.get('/status', async (req, res) => {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to the database!');
    client.release();
    res.json({ status: 'ok', message: 'Database connection successful!' });
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to connect to database.' });
  }
});

app.listen(port, () => {
  console.log(`Backend API listening at http://localhost:${port}`);
  console.log(`Connecting to DB host: ${process.env.DB_HOST}`);
});