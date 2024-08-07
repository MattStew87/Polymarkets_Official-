import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HomePage from './HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [error, setError] = useState(null);

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
