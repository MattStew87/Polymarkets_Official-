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
  StackingColumnSeries,
  Crosshair
} from '@syncfusion/ej2-react-charts';

function BarVolumeChart({ id }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const calmColors = ["#fd7f6f", "#7eb0d5", "#b2e061", "#bd7ebe", "#ffb55a", "#ffee65", "#beb9db", "#fdcce5", "#8bd3c7"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://3.141.7.141:5000/api/popularMarkets');
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
    const date = new Date(item.date).toISOString().split('T')[0];
    if (!acc[date]) acc[date] = {};
    acc[date][item.question] = parseFloat(item.total_volume);
    return acc;
  }, {});

  const chartData = Object.entries(groupedData).map(([date, volumes]) => ({
    x: date,
    ...volumes
  }));

  const formatValue = (value) => {
    if (Math.abs(value) >= 1000000000) {
      return '$' + (value / 1000000000).toFixed(1) + 'B';
    } else if (Math.abs(value) >= 1000000) {
      return '$' + (value / 1000000).toFixed(1) + 'M';
    } else if (Math.abs(value) >= 1000) {
      return '$' + (value / 1000).toFixed(1) + 'K';
    }
    return '$' + value.toFixed(2);
  };

  const axisLabelRender = (args) => {
    if (args.axis.name === 'primaryYAxis') {
      args.text = formatValue(Number(args.text.replace('$', '')));
    }
  };

  const tooltipRender = (args) => {
    if (args.series && args.point) {
      const formattedValue = formatValue(args.point.y);
      args.text = `${args.series.name}: ${formattedValue}`;
    }
  };

  return (
    <ChartComponent
      id={id}
      title='Daily Total Volume (USD) In Trending Markets'
      titleStyle={{
        fontFamily: 'Arial',
        fontWeight: '500',
        size: '18px'
      }}
      primaryXAxis={{
        valueType: 'Category',
        majorGridLines: { width: 0 },
        labelRotation: -45
      }}
      primaryYAxis={{
        title: 'Total Volume (USD)',
        labelFormat: '${value}',
        majorGridLines: { width: 1, dashArray: '2,2', color: 'grey'},
        lineStyle: { color: 'black', width: 2},
        minimum: 0
      }}
      tooltip={{ 
        enable: true,
        shared: true 
       }}
      legendSettings={{ visible: true }}
      axisLabelRender={axisLabelRender}
      tooltipRender={tooltipRender}
      crosshair={{
        enable: true,
        lineType: 'Both',
        line: {
          color: 'black'
        }
      }}
    >
      <Inject services={[StackingColumnSeries, Legend, Tooltip, DataLabel, Category, Crosshair]} />
      <SeriesCollectionDirective>
        {Object.keys(chartData[0] || {}).filter(key => key !== 'x').map((question, index) => (
          <SeriesDirective
            key={index}
            dataSource={chartData}
            xName='x'
            yName={question}
            name={question}
            type='StackingColumn'
            fill={calmColors[index % calmColors.length]}
          />
        ))}
      </SeriesCollectionDirective>
    </ChartComponent>
  );
}

export default BarVolumeChart;