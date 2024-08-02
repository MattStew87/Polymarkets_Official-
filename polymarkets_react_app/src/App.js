import React, { useEffect, useState } from 'react';

function App() {
  const [markets, setMarkets] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://3.141.7.141:5000/api/markets')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setMarkets(data))
      .catch(error => {
        console.error('Error fetching markets:', error);
        setError(error.message);
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="App">
      <h1>Polymarkets Markets</h1>
      <table>
        <thead>
          <tr>
            <th>Count</th>
            <th>Featured</th>
            <th>Question</th>
            <th>Slug</th>
            <th>Condition ID</th>
            <th>Market ID</th>
            <th>Created At</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Liquidity</th>
            <th>Volume</th>
            <th>Volume 24hr</th>
            <th>Rewards Min Size</th>
            <th>Rewards Max Spread</th>
            <th>Spread</th>
            <th>Rewards Daily Rate</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {markets.map(market => (
            <tr key={market.count}>
              <td>{market.count}</td>
              <td>{market.featured ? 'Yes' : 'No'}</td>
              <td>{market.question}</td>
              <td>{market.slug}</td>
              <td>{market.condition_id}</td>
              <td>{market.market_id}</td>
              <td>{new Date(market.created_at).toLocaleString()}</td>
              <td>{new Date(market.start_date).toLocaleString()}</td>
              <td>{new Date(market.end_date).toLocaleString()}</td>
              <td>{market.liquidity}</td>
              <td>{market.volume}</td>
              <td>{market.volume24hr}</td>
              <td>{market.rewards_min_size}</td>
              <td>{market.rewards_max_spread}</td>
              <td>{market.spread}</td>
              <td>{market.rewards_daily_rate}</td>
              <td>{new Date(market.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;