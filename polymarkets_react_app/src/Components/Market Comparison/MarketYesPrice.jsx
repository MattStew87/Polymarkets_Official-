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
  LineSeries,
  Crosshair
} from '@syncfusion/ej2-react-charts';

function MarketYesPrice({ marketToAdd, marketToRemove }) {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);

  const colors = ["#115f9a", "#1984c5", "#22a7f0", "#48b5c4", "#76c68f", "#a6d75b", "#c9e52f", "#d0ee11", "#d0f400"];

  useEffect(() => {
    const fetchData = async () => {
      if (marketToAdd) {
        try {
          const response = await axios.get('http://3.141.7.141:5000/api/marketPrices', {
            params: { question: marketToAdd }
          });
          
          const validData = response.data.filter(item => item.date && !isNaN(new Date(item.date).getTime()));
          const newData = validData.map(item => ({
            x: new Date(item.date),
            y: parseFloat(item.yesprice) || 0
          }));

          setData(prevData => {
            const updatedData = { ...prevData, [marketToAdd]: newData };

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

  useEffect(() => {
    if (marketToRemove) {
      setData(prevData => {
        const updatedData = { ...prevData };
        delete updatedData[marketToRemove];

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

  if (Object.keys(data).length === 0) {
    console.log('Data is empty, rendering watermark');
    return (
      <div style={{width: '95%', height: '450px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img 
          src="/pine_watermark.png" 
          alt="Pine Watermark" 
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            opacity: 0.5
          }}
        />
      </div>
    );
  }

  const chartData = Object.entries(data).map(([question, data]) => ({
    dataSource: data,
    xName: 'x',
    yName: 'y',
    name: question,
    type: 'Line'
  }));

  const formatValue = (value) => {
    return '$' + value.toFixed(3);
  };

  const axisLabelRender = (args) => {
    if (args.axis.name === 'primaryYAxis') {
      args.text = formatValue(parseFloat(args.text));
    }
  }; 
 
  const tooltipRender = (args) => {
    args.text = [`${args.series.name}: ${formatValue(args.point.y)}`];
  };
  
  return (
    <ChartComponent
      id="market-yes-price-chart"
      width="95%"
      height="450px"
      title="Daily Market YES Prices"
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
        minimum: 0,
        maximum: 1.000,
        interval: 0.1,
        labelFormat: '{value}',
        majorGridLines: { width: 1, dashArray: '2,2', color: 'grey'},
        minorGridLines: { width: 0 },
        majorTickLines: { width: 2, height: 8, color: 'black'},
        minorTickLines: { width: 2, height: 5, color: 'black'},
        lineStyle: { color: 'black', width: 2},
      }}
      tooltip={{
        enable: true,
        shared: true,
        format: '${series.name}: ${point.y}'
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
      <Inject services={[LineSeries, Legend, DateTime, Tooltip, Crosshair]} />
      <SeriesCollectionDirective>
        {chartData.map((series, index) => (
          <SeriesDirective
            key={index}
            dataSource={series.dataSource}
            xName={series.xName}
            yName={series.yName}
            name={series.name}
            type={series.type}
            width={2}
            marker={{ visible: true, width: 7, height: 7, shape: 'Circle', isFilled: true  }}
            fill={colors[index % colors.length]}
          />
        ))}
      </SeriesCollectionDirective>
    </ChartComponent>
  );
}

export default MarketYesPrice;