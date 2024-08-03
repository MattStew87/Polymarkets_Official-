import React, { useEffect, useState } from 'react';
import HomePage from './HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';

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
      <HomePage />  
    </div>
  );
}

export default App;