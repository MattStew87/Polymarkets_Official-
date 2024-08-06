import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TotalDataComponent = () => {
  const [todayVolume24hr, setTodayVolume24hr] = useState(null);
  const [pctChangeVolume24hr, setPctChangeVolume24hr] = useState(null);
  const [todayVolume, setTodayVolume] = useState(null);
  const [pctChangeVolume, setPctChangeVolume] = useState(null);
  const [todayLiquidity, setTodayLiquidity] = useState(null);
  const [pctChangeLiquidity, setPctChangeLiquidity] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://3.141.7.141:5000/api/totaldata');
        if (response.data.length > 0) {
          const totalData = response.data[0];
          setTodayVolume24hr(parseFloat(totalData.today_avg_volume24hr));
          setPctChangeVolume24hr(parseFloat(totalData.pct_change_volume24hr));
          setTodayVolume(parseFloat(totalData.today_avg_volume));
          setPctChangeVolume(parseFloat(totalData.pct_change_volume));
          setTodayLiquidity(parseFloat(totalData.today_avg_liquidity));
          setPctChangeLiquidity(parseFloat(totalData.pct_change_liquidity));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error fetching data');
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  
  return (
    <div className="row row-cols-xl-4 g-3 g-xl-6">
      {/* Active Markets Card */}
      <div className="col">
        <div className="card bg-success bg-opacity-10 border-success border-opacity-40">
          <div className="p-5">
            <div className="d-flex gap-3 mb-5">
              <img src="/pine_logo.png" className="avatar" alt="Pine Logo" />
              <div>
                <a className="d-inline-block text-sm text-heading fw-semibold" href="/pages/trade/details.html">
                  Active Markets
                </a>
                <span className="d-block text-xs text-muted">Bitcoin</span>
              </div>
            </div>
            <div className="d-flex align-items-end">
              <div className="hstack gap-2">
                <span className="badge bg-success bg-opacity-25 text-success">
                  +2.4%
                </span>
                <span className="badge badge-count bg-success text-xs rounded-circle">
                  <i className="bi bi-arrow-up-right" />
                </span>
              </div>
              <div className="w-rem-32 ms-auto">
                <div style={{ minHeight: 36 }}>
                  {/* Removed the mini chart */}
                </div>
              </div>
            </div>
            <div className="text-lg fw-bold text-heading mt-2">
              {todayVolume24hr !== null ? `$${todayVolume24hr.toLocaleString()}` : 'Loading...'}
            </div>
          </div>
        </div>
      </div>

      {/* Total Volume Card */}
      <div className="col">
        <div className="card bg-success bg-opacity-10 border-success border-opacity-40">
          <div className="p-5">
            <div className="d-flex gap-3 mb-5">
              <img src="/pine_logo.png" className="avatar" alt="Pine Logo" />
              <div>
                <a className="d-inline-block text-sm text-heading fw-semibold" href="/pages/trade/details.html">
                  Total Volume
                </a>
                <span className="d-block text-xs text-muted">Bitcoin</span>
              </div>
            </div>
            <div className="d-flex align-items-end">
              <div className="hstack gap-2">
                <span className="badge bg-success bg-opacity-25 text-success">
                  +{pctChangeVolume !== null ? pctChangeVolume.toFixed(2) : '0'}%
                </span>
                <span className="badge badge-count bg-success text-xs rounded-circle">
                  <i className="bi bi-arrow-up-right" />
                </span>
              </div>
              <div className="w-rem-32 ms-auto">
                <div style={{ minHeight: 36 }}>
                  {/* Removed the mini chart */}
                </div>
              </div>
            </div>
            <div className="text-lg fw-bold text-heading mt-2">
              {todayVolume !== null ? `$${todayVolume.toLocaleString()}` : 'Loading...'}
            </div>
          </div>
        </div>
      </div>

      {/* 24 Hour Volume Card */}
      <div className="col">
        <div className="card bg-success bg-opacity-10 border-success border-opacity-40">
          <div className="p-5">
            <div className="d-flex gap-3 mb-5">
              <img src="/pine_logo.png" className="avatar" alt="Pine Logo" />
              <div>
                <a className="d-inline-block text-sm text-heading fw-semibold" href="/pages/trade/details.html">
                  24 Hour Volume
                </a>
                <span className="d-block text-xs text-muted">Bitcoin</span>
              </div>
            </div>
            <div className="d-flex align-items-end">
              <div className="hstack gap-2">
                <span className="badge bg-success bg-opacity-25 text-success">
                  +{pctChangeVolume24hr !== null ? pctChangeVolume24hr.toFixed(2) : '0'}%
                </span>
                <span className="badge badge-count bg-success text-xs rounded-circle">
                  <i className="bi bi-arrow-up-right" />
                </span>
              </div>
              <div className="w-rem-32 ms-auto">
                <div style={{ minHeight: 36 }}>
                  {/* Removed the mini chart */}
                </div>
              </div>
            </div>
            <div className="text-lg fw-bold text-heading mt-2">
              {todayVolume24hr !== null ? `$${todayVolume24hr.toLocaleString()}` : 'Loading...'}
            </div>
          </div>
        </div>
      </div>

      {/* Liquidity Card */}
      <div className="col">
        <div className="card bg-success bg-opacity-10 border-success border-opacity-40">
          <div className="p-5">
            <div className="d-flex gap-3 mb-5">
              <img src="/pine_logo.png" className="avatar" alt="Pine Logo" />
              <div>
                <a className="d-inline-block text-sm text-heading fw-semibold" href="/pages/trade/details.html">
                  Liquidity
                </a>
                <span className="d-block text-xs text-muted">Bitcoin</span>
              </div>
            </div>
            <div className="d-flex align-items-end">
              <div className="hstack gap-2">
                <span className="badge bg-success bg-opacity-25 text-success">
                  +{pctChangeLiquidity !== null ? pctChangeLiquidity.toFixed(2) : '0'}%
                </span>
                <span className="badge badge-count bg-success text-xs rounded-circle">
                  <i className="bi bi-arrow-up-right" />
                </span>
              </div>
              <div className="w-rem-32 ms-auto">
                <div style={{ minHeight: 36 }}>
                  {/* Removed the mini chart */}
                </div>
              </div>
            </div>
            <div className="text-lg fw-bold text-heading mt-2">
              {todayLiquidity !== null ? `$${todayLiquidity.toLocaleString()}` : 'Loading...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalDataComponent;
