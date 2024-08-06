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

// New endpoint for liquidity
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

// New endpoint for total data
app.get('/api/totaldata', async (req, res) => {
  const query = `
    WITH MarketAverages AS (
      SELECT
          Date_trunc('day', timestamp) AS Date,
          question,
          AVG(volume24hr) AS avg_volume24hr,
          AVG(volume) AS avg_volume,
          AVG(liquidity) AS avg_liquidity
      FROM
          public.markets
      WHERE
          Date_trunc('day', timestamp) IN (Date_trunc('day', NOW()), Date_trunc('day', NOW() - INTERVAL '1 day'))
      GROUP BY
          Date_trunc('day', timestamp),
          question
    ),
    SummedAverages AS (
      SELECT
          Date,
          SUM(avg_volume24hr) AS total_avg_volume24hr,
          SUM(avg_volume) AS total_avg_volume,
          SUM(avg_liquidity) AS total_avg_liquidity
      FROM
          MarketAverages
      GROUP BY
          Date
    ),
    Today AS (
      SELECT
          total_avg_volume24hr AS today_avg_volume24hr,
          total_avg_volume AS today_avg_volume,
          total_avg_liquidity AS today_avg_liquidity
      FROM
          SummedAverages
      WHERE
          Date = Date_trunc('day', NOW())
    ),
    Yesterday AS (
      SELECT
          total_avg_volume24hr AS yesterday_avg_volume24hr,
          total_avg_volume AS yesterday_avg_volume,
          total_avg_liquidity AS yesterday_avg_liquidity
      FROM
          SummedAverages
      WHERE
          Date = Date_trunc('day', NOW() - INTERVAL '1 day')
    )
    SELECT
      today_avg_volume24hr,
      CASE WHEN yesterday_avg_volume24hr = 0 THEN NULL ELSE ((today_avg_volume24hr - yesterday_avg_volume24hr) / yesterday_avg_volume24hr) * 100 END AS pct_change_volume24hr,
      
      today_avg_volume,
      CASE WHEN yesterday_avg_volume = 0 THEN NULL ELSE ((today_avg_volume - yesterday_avg_volume) / yesterday_avg_volume) * 100 END AS pct_change_volume,

      today_avg_liquidity,
      CASE WHEN yesterday_avg_liquidity = 0 THEN NULL ELSE ((today_avg_liquidity - yesterday_avg_liquidity) / yesterday_avg_liquidity) * 100 END AS pct_change_liquidity
    FROM
      Today, Yesterday;
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
