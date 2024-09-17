import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RewardsTable = ({ marketToAdd, marketToRemove }) => {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (marketToAdd) {
        try {
          const response = await axios.get('http://3.141.7.141:5000/api/marketRewards', {
            params: { question: marketToAdd }
          });
          
          if (response.data.length > 0) {
            setData(prevData => ({
              ...prevData,
              [marketToAdd]: response.data[0] // Assuming we are interested in the first object
            }));
          } else {
            console.log('No data found for marketToAdd:', marketToAdd);
          }
        } catch (err) {
          console.error('Error fetching data:', err);
          setError('Error fetching data');
        }
      }
    };

    fetchData();
  }, [marketToAdd]);

  useEffect(() => {
    if (marketToRemove) {
      console.log('marketToRemove triggered:', marketToRemove);
      setData(prevData => {
        const updatedData = { ...prevData };
        delete updatedData[marketToRemove];
        return updatedData;
      });
    }
  }, [marketToRemove]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="border-top">
      <div className="table-responsive">
        <table className="table table-hover table-striped table-nowrap">
          <thead>
            <tr>
              <th scope="col">Market</th>
              <th className="w-md-32" scope="col">rewards start date</th>
              <th className="w-md-32 d-none d-sm-table-cell" scope="col">rewards end date</th>
              <th className="w-md-32" scope="col">rewards min size</th>
              <th className="w-md-32 d-none d-lg-table-cell" scope="col">rewards max spread</th>
              <th className="w-md-32 d-none d-sm-table-cell" scope="col">reward daily rate</th>
              <th className="w-md-32 d-none d-xl-table-cell" scope="col">spread</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([question, marketData]) => {
              

              return (
                <tr key={question}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div className="">
                        <span className="d-inline-block text-sm text-heading fw-semibold">
                          {question}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>{new Date(marketData.rewards_start_date).toLocaleDateString()}</td>
                  <td className="d-none d-sm-table-cell">{new Date(marketData.rewards_end_date).toLocaleDateString()}</td>
                  <td>{parseFloat(marketData.rewards_min_size).toFixed(1)}</td>
                  <td className="d-none d-lg-table-cell">{parseFloat(marketData.rewards_max_spread).toFixed(2)}</td>
                  <td className="d-none d-sm-table-cell">{parseFloat(marketData.reward_daily_rate).toFixed(1)}</td>
                  <td className="d-none d-xl-table-cell">{parseFloat(marketData.spread).toFixed(7)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="py-4 px-6">
        <div className="row align-items-center justify-content-between">
          <div className="col-md-6 d-none d-md-block">
            <span className="text-muted text-sm">
              Showing {Object.keys(data).length} items
            </span>
          </div>
          {/* You can add pagination here if needed */}
        </div>
      </div>
    </div>
  );
};

export default RewardsTable;
