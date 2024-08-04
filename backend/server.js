const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.get('/api/markets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM markets LIMIT 5');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// New endpoint
app.get('/api/liquidity', async (req, res) => {
  const query = `
    SELECT 
    date_trunc('day', timestamp) as Date,
    question, 
    Avg(liquidity) as Liquidity
    FROM public.markets
    WHERE slug IN ('will-donald-trump-win-the-2024-us-presidential-election', 'will-kamala-harris-win-the-2024-us-presidential-election')
    GROUP BY 1,2
  `;

  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
