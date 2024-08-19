const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');


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


/* ------------------------------ROUTES NOT IN USE CURRENTLY ------------------------ */

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
  
/* ---------------------------------SECTION END----------------------------- */




/* ---------------------------------HOME PAGE ROUTES----------------------------- */

// Fetches total and daily perent changes in totals 
app.get('/api/overallData', async (req, res) => {
  const query = `
        WITH MarketAverages24 AS (
            SELECT
                question,
                AVG(volume24hr) AS volume24hr,
                AVG(volume) AS volume,
                AVG(liquidity) AS liquidity
            FROM
                public.markets
            WHERE timestamp >= NOW() - INTERVAL '24 hours'
            GROUP BY
                question
        ),
        MarketAverages48 AS (
            SELECT
                question,
                AVG(volume24hr) AS volume24hr,
                AVG(volume) AS volume,
                AVG(liquidity) AS liquidity
            FROM
                public.markets
            WHERE timestamp >= NOW() - INTERVAL '48 hours'
                AND timestamp < NOW() - INTERVAL '24 hours'
            GROUP BY
                question
        ),
        SummedAverages24 AS (
            SELECT
                SUM(volume24hr) AS total_volume24hr_24,
                SUM(volume) AS total_volume_24,
                SUM(liquidity) AS total_liquidity_24,
                COUNT(DISTINCT question) AS total_markets_24
            FROM
                MarketAverages24
        ),
        SummedAverages48 AS (
            SELECT
                SUM(volume24hr) AS total_volume24hr_48,
                SUM(volume) AS total_volume_48,
                SUM(liquidity) AS total_liquidity_48,
                COUNT(DISTINCT question) AS total_markets_48
            FROM
                MarketAverages48
        )
        SELECT
            sa48.total_volume24hr_48 AS yesterday_avg_volume24hr,
            sa24.total_volume24hr_24 AS today_avg_volume24hr,
            CASE 
                WHEN sa48.total_volume24hr_48 = 0 THEN NULL 
                ELSE ((sa24.total_volume24hr_24 - sa48.total_volume24hr_48) / sa48.total_volume24hr_48) * 100 
            END AS pct_change_volume24hr,

            sa48.total_volume_48 AS yesterday_avg_volume,
            sa24.total_volume_24 AS today_avg_volume,
            CASE 
                WHEN sa48.total_volume_48 = 0 THEN NULL 
                ELSE ((sa24.total_volume_24 - sa48.total_volume_48) / sa48.total_volume_48) * 100 
            END AS pct_change_volume,

            sa48.total_liquidity_48 AS yesterday_avg_liquidity, 
            sa24.total_liquidity_24 AS today_avg_liquidity,
            CASE 
                WHEN sa48.total_liquidity_48 = 0 THEN NULL 
                ELSE ((sa24.total_liquidity_24 - sa48.total_liquidity_48) / sa48.total_liquidity_48) * 100 
            END AS pct_change_liquidity,

            sa48.total_markets_48 AS yesterday_total_markets, 
            sa24.total_markets_24 AS today_total_markets,
            CASE 
                WHEN sa48.total_markets_48 = 0 THEN NULL 
                ELSE ((sa24.total_markets_24 - sa48.total_markets_48) / sa48.total_markets_48::numeric) * 100 
            END AS pct_change_markets
        FROM
            SummedAverages24 sa24, SummedAverages48 sa48;
  `;

  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Fetches overall data overtime 
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

/* ---------------------------------SECTION END----------------------------- */






/* ---------------------------------Search Event Page API----------------------------- */


// List of all current events
app.get('/api/searchEvents', async (req, res) => {
    const query = `
        WITH tab1 AS (
            SELECT 
                title, 
                AVG(volume) AS Volume
            FROM public.events
            WHERE timestamp >= NOW() - INTERVAL '24 hours'
            GROUP BY 1 
            ORDER BY 2 DESC 
        ) 
        SELECT 
            title 
        FROM tab1 
    `;
  
    try {
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});


// Totals for the event and daily percent change in totals 
app.get('/api/eventOverall', async (req, res) => {
    const { title } = req.query; 

    const query = `
        WITH Last24Hours AS (
            SELECT 
                avg(Volume) as avgVolume,
                avg(volume24hr) as avgVolume24Hr, 
                avg(liquidity) as avgLiquidity
            FROM public.events
            WHERE title = $1
            AND timestamp >= now() - interval '24 hours'
        ),
        Last48Hours AS (
            SELECT 
                avg(Volume) as avgVolume,
                avg(volume24hr) as avgVolume24Hr, 
                avg(liquidity) as avgLiquidity
            FROM public.events
            WHERE title = $1
            AND timestamp >= now() - interval '48 hours'
            AND timestamp < now() - interval '24 hours'
        )
        SELECT
            Last24Hours.avgVolume as currentVolume,
            Last48Hours.avgVolume as previousVolume,
            CASE 
                WHEN Last48Hours.avgVolume > 0 
                THEN (Last24Hours.avgVolume - Last48Hours.avgVolume) / Last48Hours.avgVolume * 100
                ELSE NULL
            END as volumePercentChange,

            Last24Hours.avgVolume24Hr as currentVolume24Hr,
            Last48Hours.avgVolume24Hr as previousVolume24Hr,
            CASE 
                WHEN Last48Hours.avgVolume24Hr > 0 
                THEN (Last24Hours.avgVolume24Hr - Last48Hours.avgVolume24Hr) / Last48Hours.avgVolume24Hr * 100
                ELSE NULL
            END as volume24HrPercentChange,

            Last24Hours.avgLiquidity as currentLiquidity,
            Last48Hours.avgLiquidity as previousLiquidity,
            CASE 
                WHEN Last48Hours.avgLiquidity > 0 
                THEN (Last24Hours.avgLiquidity - Last48Hours.avgLiquidity) / Last48Hours.avgLiquidity * 100
                ELSE NULL
            END as liquidityPercentChange
        FROM Last24Hours, Last48Hours;

    `;

    try {
      const result = await pool.query(query, [title]);  // Pass the title as a parameter to the query
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

// Graphs by market for each event 
app.get('/api/eventBreakdown', async (req, res) => {
    const { title } = req.query; 

    const query = `
        WITH tab1 AS (
            SELECT 
                market ->> 'Question' as Question,
                market ->> 'ID' as ID,
                market ->> 'Slug' as Slug,
                NULLIF(market ->> 'Volume', '')::numeric as Volume,
                NULLIF(market ->> 'spread', '')::numeric as Spread,
                (market ->> 'EndDate')::timestamp as EndDate,
                market ->> 'Featured' as Featured,
                market ->> 'Outcomes' as Outcomes,
                NULLIF(market ->> 'Liquidity', '')::numeric as Liquidity,
                (market ->> 'StartDate')::timestamp as StartDate,
                (market ->> 'Timestamp')::timestamp as Timestamp,
                NULLIF(market ->> 'Volume24hr', '')::numeric as Volume24hr,
                market ->> 'ConditionID' as ConditionID,
                (market ->> 'CreatedDate')::timestamp as CreatedDate,
                market ->> 'CLOBTokenIDs' as CLOBTokenIDs,
                (market ->> 'OutcomePrices') as OutcomePrices,
                COALESCE(NULLIF(replace((regexp_split_to_array(trim(both '[]' from market ->> 'OutcomePrices'), ',\s*'))[1], '"', ''), ''), '0')::numeric as YesPrice, 
                COALESCE(NULLIF(replace((regexp_split_to_array(trim(both '[]' from market ->> 'OutcomePrices'), ',\s*'))[2], '"', ''), ''), '0')::numeric as NoPrice,
                (market ->> 'rewardsEndDate')::timestamp as RewardsEndDate,
                NULLIF(market ->> 'rewardsMinSize', '')::numeric as RewardsMinSize,
                NULLIF(market ->> 'rewardsDailyRate', '')::numeric as RewardsDailyRate,
                NULLIF(market ->> 'rewardsMaxSpread', '')::numeric as RewardsMaxSpread,
                (market ->> 'rewardsStartDate')::timestamp as RewardsStartDate
            FROM 
                events e,
                jsonb_array_elements(e.Markets::jsonb) as market
            WHERE title = $1
        ) 


        SELECT
            date_trunc('day', Timestamp) as Date, 
            Question,
            avg(Volume) as Volume, 
            avg(Spread) as Spread, 
            avg(Volume24hr) as Volume24hr, 
            avg(Liquidity) as Liquidity, 
            avg(YesPrice) as YesPrice,
            avg(NoPrice) as NoPrice
        FROM tab1 
        GROUP BY 1,2;   
    `;

    try {
      const result = await pool.query(query, [title]);  // Pass the title as a parameter to the query
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

/* ---------------------------------SECTION END----------------------------- */



/* ---------------------------------Market Comparison Page API----------------------------- */

// List of all current events
app.get('/api/searchMarkets', async (req, res) => {
    const query = `
        WITH tab1 AS (
            SELECT 
                question, 
                AVG(volume) AS Volume
            FROM public.markets
            WHERE timestamp >= NOW() - INTERVAL '24 hours'
            GROUP BY 1 
            ORDER BY 2 DESC 
        ) 
        SELECT 
            question 
        FROM tab1 
    `;
  
    try {
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

app.get('/api/marketBreakdown', async (req, res) => {
    const { question } = req.query;

    const query = `
        SELECT 
            date_trunc('day', timestamp) as Date,
            question,  
            avg(liquidity) as Liquidity, 
            avg(volume) as Volume, 
            avg(volume24hr) as Volume24hr,
            
        FROM public.markets
        WHERE question = $1
        GROUP BY 1,2
        ORDER BY 1;
    `;
  
    try {
      const result = await pool.query(query, [question]);
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});


app.get('/api/test', async (req, res) => {
    const { question } = req.query;

    const query = `
        SELECT 
            outcome_prices
        FROM public.markets
        WHERE question = $1
        ORDER BY 1;
    `;
  
    try {
      const result = await pool.query(query, [question]);
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

/* ------------------------------------SECTION END----------------------------------------- */





/* ------------------------------------SECTION START----------------------------------------- */
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../polymarkets_react_app/build')));

// Catch-all handler to serve React's index.html for any unknown routes
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../polymarkets_react_app/build', 'index.html'));
});
/* ------------------------------------SECTION END----------------------------------------- */



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
