import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import EventMarkets from './EventsMarkets';
import HomePage from './HomePage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events-markets" element={<EventMarkets />} />
      </Routes>
    </div>
  );
}

export default App;
