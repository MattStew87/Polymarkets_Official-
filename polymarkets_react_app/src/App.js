import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HomePage from './HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [markets, setMarkets] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://3.141.7.141:5000/api/markets');
        setMarkets(response.data);
      } catch (error) {
        console.error('Error fetching markets:', error);
        setError(error.message);
      }
    };

    fetchData();
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
