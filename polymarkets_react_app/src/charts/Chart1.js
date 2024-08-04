import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject,
  Legend, Category, Tooltip, DataLabel, StackingLineSeries
} from '@syncfusion/ej2-react-charts';

function Chart1() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://3.141.7.141:5000/api/liquidity');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Process data to group by question
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.question]) {
      acc[item.question] = [];
    }
    acc[item.question].push({
      x: new Date(item.date).toLocaleDateString(),
      y: parseFloat(item.liquidity)
    });
    return acc;
  }, {});

  return (
    <div className="chart1">
      {Object.keys(groupedData).map((question, index) => (
        <div key={index}>
          <h3>{question}</h3>
          <ChartComponent
            id={`chart-${index}`}
            primaryXAxis={{ valueType: 'Category' }}
            primaryYAxis={{ title: 'Liquidity', labelFormat: '{value}' }}
            title={question}
          >
            <Inject services={[StackingLineSeries, Legend, Tooltip, DataLabel, Category]} />
            <SeriesCollectionDirective>
              <SeriesDirective
                dataSource={groupedData[question]}
                xName='x'
                yName='y'
                name={question}
                type='StackingLine'
                marker={{ visible: true }}
              />
            </SeriesCollectionDirective>
          </ChartComponent>
        </div>
      ))}
    </div>
  );
}

export default Chart1;
