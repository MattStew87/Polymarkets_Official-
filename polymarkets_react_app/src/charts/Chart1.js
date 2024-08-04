import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  Legend,
  Category,
  Tooltip,
  DataLabel,
  StackingLineSeries,
  Crosshair
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

  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.question]) acc[item.question] = [];
    acc[item.question].push({ x: new Date(item.date).toLocaleDateString(), y: parseFloat(item.liquidity) });
    return acc;
  }, {});

  const marker = { visible: true, shape: 'Circle', width: 10, height: 10, border: { width: 1, color: '#F8AB1D' } };

  return (
    <ChartComponent
      id="charts"
      primaryXAxis={{
        valueType: 'Category',
        majorGridLines: { width: 1, dashArray: '4,4' },
        majorTickLines: { width: 2, height: 8, color: 'black',},
        lineStyle: { color: 'black', width: 2}
      }}
      primaryYAxis={{
        title: 'Liquidity',
        labelFormat: '${value}',
        majorGridLines: { width: 1, dashArray: '2,2', color: 'grey'},
        majorTickLines: { width: 2, height: 8, color: 'black',},
        minorTickLines: { width: 2, height: 5, color: 'black'},
        lineStyle: { color: 'black', width: 2},
        minimum: 0,
        minorTicksPerInterval: 1
      }}
      tooltip={{ enable: true, shared: true }}
      crosshair={{
        enable: true,
        lineType: 'Both',
        line: {
          color: 'black'
        }
      }}
    >
      <Inject services={[StackingLineSeries, Crosshair, Legend, Tooltip, DataLabel, Category]} />
      <SeriesCollectionDirective>
        {Object.keys(groupedData).map((question, index) => (
          <SeriesDirective
            key={index}
            dataSource={groupedData[question]}
            xName="x"
            yName="y"
            name={question}
            width="2"
            type="StackingLine"
            marker={marker}
          />
        ))}
      </SeriesCollectionDirective>
    </ChartComponent>
  );
}

export default Chart1;
