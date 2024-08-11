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


// New endpoint for liquidity used in TestChart.jsx 
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

// New endpoint for Overall Data used in TotalDataComponent.jsx 
app.get('/api/overallData', async (req, res) => {
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
              SUM(avg_liquidity) AS total_avg_liquidity,
              COUNT(DISTINCT question) AS total_markets
          FROM
              MarketAverages
          GROUP BY
              Date
      ),
      Today AS (
          SELECT
              total_avg_volume24hr AS today_avg_volume24hr,
              total_avg_volume AS today_avg_volume,
              total_avg_liquidity AS today_avg_liquidity,
              total_markets AS today_total_markets
          FROM
              SummedAverages
          WHERE
              Date = Date_trunc('day', NOW())
      ),
      Yesterday AS (
          SELECT
              total_avg_volume24hr AS yesterday_avg_volume24hr,
              total_avg_volume AS yesterday_avg_volume,
              total_avg_liquidity AS yesterday_avg_liquidity,
              total_markets AS yesterday_total_markets
          FROM
              SummedAverages
          WHERE
              Date = Date_trunc('day', NOW() - INTERVAL '1 day')
      )
      SELECT
          yesterday_avg_volume24hr,
          today_avg_volume24hr,
          CASE WHEN yesterday_avg_volume24hr = 0 THEN NULL ELSE ((today_avg_volume24hr - yesterday_avg_volume24hr) / yesterday_avg_volume24hr) * 100 END AS pct_change_volume24hr,
          
          yesterday_avg_volume,
          today_avg_volume,
          CASE WHEN yesterday_avg_volume = 0 THEN NULL ELSE ((today_avg_volume - yesterday_avg_volume) / yesterday_avg_volume) * 100 END AS pct_change_volume,

          yesterday_avg_liquidity, 
          today_avg_liquidity,
          CASE WHEN yesterday_avg_liquidity = 0 THEN NULL ELSE ((today_avg_liquidity - yesterday_avg_liquidity) / yesterday_avg_liquidity) * 100 END AS pct_change_liquidity,

          yesterday_total_markets, 
          today_total_markets,
          CASE WHEN yesterday_total_markets = 0 THEN NULL ELSE ((today_total_markets - yesterday_total_markets) / yesterday_total_markets::numeric) * 100 END AS pct_change_markets
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


// New endpoint for Overall data overtime used in 
// MarketVolume.jsx, MarketVolume24hr.jsx, and MarketLiquidity.jsx
app.get('/api/overtimeData', async (req, res) => {
    const query = `
            With tab1 as (
            Select
            date_trunc('day', timestamp) as Date, 
            Question, 
            avg(liquidity) as Liquidity, 
            avg(volume) as Volume, 
            avg(volume24hr) as Volume24hr
            from public.markets 
            group by 1,2 
            )  

            Select
            Date, 
            Sum(Liquidity) as Total_Liquidity, 
            Sum(volume) as Total_Volume, 
            Sum(volume24hr) as Total_Volume24hr
            from tab1  
            group by 1 
            order by 1    
    `;
  
    try {
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});




// Gets trending markets used in are chart in Popular Markets Folder
// Delete (Eventually) 
app.get('/api/popularMarkets', async (req, res) => {
  const query = `
            WITH VolumeData AS (
        SELECT
            Date_trunc('day', timestamp) AS Date,
            question,
            AVG(volume) AS average_volume
        FROM
            public.markets
        GROUP BY
            Date_trunc('day', timestamp),
            question
    ),
    VolumeComparison AS (
        SELECT
            Date,
            question,
            average_volume,
            LAG(average_volume, 3) OVER (PARTITION BY question ORDER BY Date) AS volume_three_days_ago
        FROM
            VolumeData
    ),
    TopVolumeChanges AS (
        SELECT
            Date,
            question,
            average_volume AS volume_today,
            volume_three_days_ago,
            ((average_volume - volume_three_days_ago) / NULLIF(volume_three_days_ago, 0)) * 100 AS percentage_change
        FROM
            VolumeComparison
        WHERE
            Date = Date_trunc('day', NOW())
        AND
            volume_three_days_ago IS NOT NULL
        ORDER BY
            percentage_change DESC
        LIMIT 200
    )


    , SpreadFilter as (
    SELECT
        m.question,
        AVG(m.spread) AS spread
    FROM
        public.markets m
    WHERE
        Date_trunc('day', m.timestamp) = Date_trunc('day', NOW())
        AND m.question IN (SELECT question FROM TopVolumeChanges)
    GROUP BY
        m.question
    ORDER BY
        spread DESC 
    LIMIT 50 
    ) 

    , tab_final as (
    SELECT
        m.question,
        AVG(m.volume) AS volume
    FROM
        public.markets m
    WHERE
        Date_trunc('day', m.timestamp) = Date_trunc('day', NOW())
        AND m.question IN (SELECT question FROM SpreadFilter)
    GROUP BY
        m.question
    ORDER BY
        volume DESC 
    LIMIT 5
    ) 


    select 
    Date_trunc('day', timestamp) as Date, 
    question, 
    avg(volume) as Total_Volume, 
    avg(volume24hr) as Volume_24_Hour, 
    avg(liquidity) as Liquidity,
    avg(spread) as Spread

    from public.markets 
    where question in (select question from tab_final) 
    group by 1,2  
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
