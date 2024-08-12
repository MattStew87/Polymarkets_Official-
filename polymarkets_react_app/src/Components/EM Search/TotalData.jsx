import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TotalData = ({ event }) => {
  const [todayVolume24hr, setTodayVolume24hr] = useState(null);
  const [pctChangeVolume24hr, setPctChangeVolume24hr] = useState(null);
  const [todayVolume, setTodayVolume] = useState(null);
  const [pctChangeVolume, setPctChangeVolume] = useState(null);
  const [todayLiquidity, setTodayLiquidity] = useState(null);
  const [pctChangeLiquidity, setPctChangeLiquidity] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (event) {  
      const fetchData = async () => {
        try {
          console.log('Fetching data for event:', event);
          const response = await axios.get('http://3.141.7.141:5000/api/eventOverall', {
              params: { title: event }  
          });

          if (response.data.length > 0) {
            const totalData = response.data[0];
            setTodayVolume24hr(parseFloat(totalData.currentvolume24hr));
            setPctChangeVolume24hr(parseFloat(totalData.volume24hrpercentchange));
            setTodayVolume(parseFloat(totalData.currentvolume));
            setPctChangeVolume(parseFloat(totalData.volumepercentchange));
            setTodayLiquidity(parseFloat(totalData.currentliquidity));
            setPctChangeLiquidity(parseFloat(totalData.liquiditypercentchange));
          } else {
            setError('No data found');
          }
        } catch (err) {
          console.error('Error fetching data:', err);
          setError('Error fetching data');
        }
      };

      fetchData();
    }
  }, [event]);

  if (error) {
    console.log('Rendering error:', error);
    return <div>{error}</div>;
  }

  if (!todayVolume && !todayVolume24hr && !todayLiquidity) {
    console.log('Data is still loading...');
    return <div>Loading...</div>;
  }


  const getCardClasses = (change) => {
    return change >= 0 ? 'card bg-success bg-opacity-10 border-success border-opacity-40' : 'card bg-danger bg-opacity-10 border-danger border-opacity-40';
    };

    const getBadgeClasses = (change) => {
        return change >= 0 ? 'badge bg-success bg-opacity-25 text-success' : 'badge bg-danger bg-opacity-25 text-danger';
    };

    const getArrowIcon = (change) => {
        return change >= 0 ? 'bi bi-arrow-up-right' : 'bi bi-arrow-down-left';
    };

    const getArrowBadgeClasses = (change) => {
        return change >= 0 ? 'badge badge-count bg-success text-xs rounded-circle' : 'badge badge-count bg-danger text-xs rounded-circle';
    };

  return (
    <div className="row row-cols-xl-4 g-3 g-xl-6">
      {/* Total Volume Card */}
      <div className="col">
        <div className={getCardClasses(pctChangeVolume)}>
          <div className="p-5">
            <div className="d-flex gap-3 mb-5">
              <img src="/pine_logo.png" className="avatar" alt="Pine Logo" />
              <div>
                <a className="d-inline-block text-sm text-heading fw-semibold" href="/pages/trade/details.html">
                  Total Volume
                </a>
                <span className="d-block text-xs text-muted">Pine</span>
              </div>
            </div>
            <div className="d-flex align-items-end">
              <div className="hstack gap-2">
                <span className={getBadgeClasses(pctChangeVolume)}>
                  {pctChangeVolume !== null ? pctChangeVolume.toFixed(2) : '0'}%
                </span>
                <span className={getArrowBadgeClasses(pctChangeVolume)}>
                  <i className={getArrowIcon(pctChangeVolume)} />
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
        <div className={getCardClasses(pctChangeVolume24hr)}>
          <div className="p-5">
            <div className="d-flex gap-3 mb-5">
              <img src="/pine_logo.png" className="avatar" alt="Pine Logo" />
              <div>
                <a className="d-inline-block text-sm text-heading fw-semibold" href="/pages/trade/details.html">
                  24 Hour Volume
                </a>
                <span className="d-block text-xs text-muted">Pine</span>
              </div>
            </div>
            <div className="d-flex align-items-end">
              <div className="hstack gap-2">
                <span className={getBadgeClasses(pctChangeVolume24hr)}>
                  {pctChangeVolume24hr !== null ? pctChangeVolume24hr.toFixed(2) : '0'}%
                </span>
                <span className={getArrowBadgeClasses(pctChangeVolume24hr)}>
                  <i className={getArrowIcon(pctChangeVolume24hr)} />
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
        <div className={getCardClasses(pctChangeLiquidity)}>
          <div className="p-5">
            <div className="d-flex gap-3 mb-5">
              <img src="/pine_logo.png" className="avatar" alt="Pine Logo" />
              <div>
                <a className="d-inline-block text-sm text-heading fw-semibold" href="/pages/trade/details.html">
                  Liquidity
                </a>
                <span className="d-block text-xs text-muted">Pine</span>
              </div>
            </div>
            <div className="d-flex align-items-end">
              <div className="hstack gap-2">
                <span className={getBadgeClasses(pctChangeLiquidity)}>
                  {pctChangeLiquidity !== null ? pctChangeLiquidity.toFixed(2) : '0'}%
                </span>
                <span className={getArrowBadgeClasses(pctChangeLiquidity)}>
                  <i className={getArrowIcon(pctChangeLiquidity)} />
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

export default TotalData;
