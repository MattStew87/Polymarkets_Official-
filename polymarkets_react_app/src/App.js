import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import EventMarkets from './EventsMarkets';
import HomePage from './HomePage';
import MarketComparison from './MarketComparison';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Redirect from root path to /HomePage */}
        <Route path="/" element={<Navigate to="/HomePage" />} />
        
        {/* Define the /HomePage route */}
        <Route path="/HomePage" element={<HomePage />} />
        
        {/* Define the /events-markets route */}
        <Route path="/events-markets" element={<EventMarkets />} />

        <Route path="/market-comparison" element={<MarketComparison />} />

      </Routes>
    </div>
  );
}

export default App;
