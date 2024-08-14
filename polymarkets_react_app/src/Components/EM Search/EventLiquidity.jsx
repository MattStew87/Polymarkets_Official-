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
  StackingColumnSeries,
  Crosshair
} from '@syncfusion/ej2-react-charts';

function EventLiquidity({ event }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);

  const calmColors = ["#b30000", "#7c1158", "#4421af", "#1a53ff", "#0d88e6", "#00b7c7", "#5ad45a", "#8be04e", "#ebdc78"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://3.141.7.141:5000/api/eventBreakdown', {
          params: { title: event }  
        });
        
        // Filter out invalid dates
        const validData = response.data.filter(item => item.date && !isNaN(new Date(item.date).getTime()));
        setData(validData);
  
        if (validData.length > 0) {
          const dates = validData.map(item => new Date(item.date));
          const earliestDate = new Date(Math.min(...dates));
          const latestDate = new Date(Math.max(...dates));
  
          earliestDate.setDate(earliestDate.getDate() - 1);
          setMinDate(earliestDate);
  
          latestDate.setDate(latestDate.getDate() + 1);
          setMaxDate(latestDate);
        } else {
          setError('No valid data available');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'An error occurred while fetching data');
      }
    };
  
    fetchData();
  }, [event]);

  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.question]) acc[item.question] = [];
    const date = new Date(item.date);
    if (!isNaN(date.getTime())) {
      acc[item.question].push({ x: date, y: parseFloat(item.liquidity) || 0 });
    }
    return acc;
  }, {});
  
  const chartData = Object.entries(groupedData).map(([question, data]) => ({
    dataSource: data,
    xName: 'x',
    yName: 'y',
    name: question,
    type: 'StackingColumn'
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
    let tooltipData = args.series.map((series, index) => ({
      name: series.name,
      y: args.point[index].y,
      formattedValue: formatValue(args.point[index].y)
    }));
  
    tooltipData.sort((a, b) => b.y - a.y);
    args.text = tooltipData.map(item => `${item.name}: ${item.formattedValue}`);
  };
  return (
    <ChartComponent
      id="event-liquidity-chart"
      title={`Daily Liquidity for ${event}`}
      titleStyle={{
        fontFamily: 'Arial',
        fontWeight: '500',
        size: '18px'
      }}
      primaryXAxis={{
        valueType: 'DateTime',
        edgeLabelPlacement: 'Shift',
        minimum: minDate,
        maximum: maxDate,
        majorGridLines: { width: 0 },
        intervalType: 'Days',
        labelRotation: -45
      }}
      primaryYAxis={{
        title: 'Liquidity',
        labelFormat: '${value}',
        majorGridLines: { width: 1, dashArray: '2,2', color: 'grey'},
        lineStyle: { color: 'black', width: 2},
        minimum: 0
      }}
      tooltip={{
        enable: true,
        shared: true,
        format: '${series.name}: ${point.y}'
      }}
      legendSettings={{ visible: true }}
      axisLabelRender={axisLabelRender}
      sharedTooltipRender={tooltipRender}
      crosshair={{
        enable: true,
        lineType: 'Vertical',
        line: {
          color: 'black'
        }
      }}
    >
      <Inject services={[StackingColumnSeries, Legend, DateTime, Tooltip, DataLabel, Crosshair]} />
      <SeriesCollectionDirective>
      {chartData.map((series, index) => (
        <SeriesDirective
          key={index}
          dataSource={series.dataSource}
          xName={series.xName}
          yName={series.yName}
          name={series.name}
          type={series.type}
          fill={calmColors[index % calmColors.length]}
        />
      ))}
    </SeriesCollectionDirective>
    </ChartComponent>
  );
}

export default EventLiquidity;