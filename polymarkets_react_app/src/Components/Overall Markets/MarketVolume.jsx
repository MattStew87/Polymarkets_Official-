import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  Legend,
  DateTime,
  Tooltip,
  DataLabel,
  ColumnSeries,
  Crosshair
} from '@syncfusion/ej2-react-charts';

function MarketVolume({ id }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://3.141.7.141:5000/api/overtimeData');
        setData(response.data);

        const dates = response.data.map(item => new Date(item.date));
        const earliestDate = new Date(Math.min(...dates));
        const latestDate = new Date(Math.max(...dates));

        // Set minDate to one day before the earliest date
        earliestDate.setDate(earliestDate.getDate() - 1);
        setMinDate(earliestDate);

        // Set maxDate to one day after the latest date
        latestDate.setDate(latestDate.getDate() + 1);
        setMaxDate(latestDate);
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

  const chartData = data.map(item => ({
    x: new Date(item.date), // Use the Date object directly
    y: parseFloat(item.total_volume)
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

  /*
  const tooltipRender = (args) => {
    if (args.series && args.point) {
      const formattedValue = formatValue(args.point.y);
      args.text = `${formattedValue}`;
    }
  };
  */ 

  const tooltipRender = (args) => {
    if (args.series && args.point) {
      const formattedValue = formatValue(args.point.y);
      const date = new Date(args.point.x);
      const formattedDate = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      });
      args.text = `${formattedDate}:\n${formattedValue}`;
    }
  };

  return (
    <ChartComponent
      id={id}
      width = "100%"
      title='Daily Total Volume (USD)'
      titleStyle={{
        fontFamily: 'Arial',
        fontWeight: '600',
        size: '18px'
      }}
      primaryXAxis={{
        valueType: 'DateTime',
        minimum: minDate,
        maximum: maxDate,
        intervalType: 'Days',
        majorGridLines: { width: 1, dashArray: '2,2', color: 'grey'},
        minorGridLines: { width: 0 },
        majorTickLines: { width: 2, height: 8, color: 'black'},
        edgeLabelPlacement: 'Shift',
        lineStyle: { color: 'black', width: 2}
      }} 
      primaryYAxis={{
        labelFormat: '${value}',
        majorGridLines: { width: 1, dashArray: '2,2', color: 'grey'},
        minorGridLines: { width: 0 },
        majorTickLines: { width: 2, height: 8, color: 'black'},
        minorTickLines: { width: 2, height: 5, color: 'black'},
        lineStyle: { color: 'black', width: 2},
        minimum: 0,
        minorTicksPerInterval: 1
      }}
      tooltip={{ 
        enable: true
       }}
      legendSettings={{ visible: false }}
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
      <Inject services={[ColumnSeries, Legend, Tooltip, DataLabel, DateTime, Crosshair]} />
      <SeriesCollectionDirective>
        <SeriesDirective
          dataSource={chartData}
          xName='x'
          yName='y'
          name='Volume'
          type='Column'
          fill='#115f9a'
          columnWidth={0.8}
          columnSpacing={0.1}
        />
      </SeriesCollectionDirective>
    </ChartComponent>
  );
}

export default MarketVolume;
