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

function Volume24Market({ marketToAdd, marketToRemove }) {
    const [data, setData] = useState({});
    const [error, setError] = useState(null);
    const [minDate, setMinDate] = useState(null);
    const [maxDate, setMaxDate] = useState(null);
  
    const calmColors = ["#115f9a", "#1984c5", "#22a7f0", "#48b5c4", "#76c68f", "#a6d75b", "#c9e52f", "#d0ee11", "#d0f400"];
  
    // Effect to handle adding data when a new market is added
    useEffect(() => {
      const fetchData = async () => {
        if (marketToAdd) {
          try {
            const response = await axios.get('http://3.141.7.141:5000/api/marketBreakdown', {
              params: { question: marketToAdd }
            });
            
            const validData = response.data.filter(item => item.date && !isNaN(new Date(item.date).getTime()));
            const newData = validData.map(item => ({ x: new Date(item.date), y: parseFloat(item.volume24hr) || 0 }));
  
            setData(prevData => {
              const updatedData = { ...prevData, [marketToAdd]: newData };
  
              // Update the minDate and maxDate based on new data
              const allDates = Object.values(updatedData).flat().map(item => item.x);
              const earliestDate = new Date(Math.min(...allDates));
              const latestDate = new Date(Math.max(...allDates));
  
              earliestDate.setDate(earliestDate.getDate() - 1);
              latestDate.setDate(latestDate.getDate() + 1);
  
              setMinDate(earliestDate);
              setMaxDate(latestDate);
  
              return updatedData;
            });
          } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message || 'An error occurred while fetching data');
          }
        }
      };
  
      fetchData();
    }, [marketToAdd]);
  
    // Effect to handle removing data when a market is removed
    useEffect(() => {
      if (marketToRemove) {
        setData(prevData => {
          const updatedData = { ...prevData };
          delete updatedData[marketToRemove];
  
          // Update the minDate and maxDate based on remaining data
          const allDates = Object.values(updatedData).flat().map(item => item.x);
          const earliestDate = allDates.length ? new Date(Math.min(...allDates)) : null;
          const latestDate = allDates.length ? new Date(Math.max(...allDates)) : null;
  
          if (earliestDate && latestDate) {
            earliestDate.setDate(earliestDate.getDate() - 1);
            latestDate.setDate(latestDate.getDate() + 1);
            setMinDate(earliestDate);
            setMaxDate(latestDate);
          } else {
            setMinDate(null);
            setMaxDate(null);
          }
  
          return updatedData;
        });
      }
    }, [marketToRemove]);
  
    const chartData = Object.entries(data).map(([question, data]) => ({
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
        id="market-Volume24hr-chart"
        width = "95%"
        title={`Daily Total Volume by Market`}
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
          enable: true,
          shared: true,
          format: '${series.name}: ${point.y}'
        }}
        legendSettings={{ visible: true }}
        axisLabelRender={axisLabelRender}
        sharedTooltipRender={tooltipRender}
        crosshair={{
          enable: true,
          lineType: 'Both',
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
            marker={{
                isFilled: true, 
                fill: calmColors[index % calmColors.length]
              }}
          />
        ))}
      </SeriesCollectionDirective>
      </ChartComponent>
    );
}
  
export default Volume24Market;
  

