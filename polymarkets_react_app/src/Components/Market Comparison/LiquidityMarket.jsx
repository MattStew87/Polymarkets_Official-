import React, { useEffect, useState, useRef } from 'react';
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

function LiquidityMarket({ marketToAdd, marketToRemove }) {
    const [data, setData] = useState({});
    const [error, setError] = useState(null);
    const [minDate, setMinDate] = useState(null);
    const [maxDate, setMaxDate] = useState(null);
    const [cache, setCache] = useState({});
    const pendingRequests = useRef(new Set());
  
    const calmColors = ["#115f9a", "#1984c5", "#22a7f0", "#48b5c4", "#76c68f", "#a6d75b", "#c9e52f", "#d0ee11", "#d0f400"];

    // Utility function to update date ranges
    const updateDateRanges = (chartData) => {
      const allDates = Object.values(chartData).flat().map(item => item.x);
      
      if (allDates.length === 0) {
          setMinDate(null);
          setMaxDate(null);
          return;
      }

      const earliestDate = new Date(Math.min(...allDates));
      const latestDate = new Date(Math.max(...allDates));

      earliestDate.setDate(earliestDate.getDate() - 1);
      latestDate.setDate(latestDate.getDate() + 1);

      setMinDate(earliestDate);
      setMaxDate(latestDate);
    };


    // Effect to handle adding data when a new market is added
    useEffect(() => {
      const fetchData = async () => {
        if (marketToAdd) {
          // Check if data for this market is already in cache
          if (cache[marketToAdd]) {
            setData(prevData => {
              const updatedData = { ...prevData, [marketToAdd]: cache[marketToAdd] };

              updateDateRanges(updatedData);
              return updatedData;
            });
            return; // Exit early if data was found in cache
          }

          // Add this market to pending requests
          pendingRequests.current.add(marketToAdd);

          try {
            const response = await axios.get('http://3.141.7.141:5000/api/marketBreakdown', {
              params: { question: marketToAdd }
            });

            // Check if this market was removed while the request was pending
            if (!pendingRequests.current.has(marketToAdd)) {
              return; // Don't update state if the market was removed
            }
            
            const validData = response.data.filter(item => item.date && !isNaN(new Date(item.date).getTime()));
            const newData = validData.map(item => ({ x: new Date(item.date), y: parseFloat(item.liquidity) || 0 }));

            setData(prevData => {
              const updatedData = { ...prevData, [marketToAdd]: newData };
            
              updateDateRanges(updatedData);
              return updatedData;
            });

            // Store the fetched data in the cache
            setCache(prevCache => ({ ...prevCache, [marketToAdd]: newData }));

            // Remove from pending requests after successful addition
            pendingRequests.current.delete(marketToAdd);
          } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message || 'An error occurred while fetching data');
            pendingRequests.current.delete(marketToAdd);
          }
        }
      };

      fetchData();
    }, [marketToAdd]);
  
    // Effect to handle removing data when a market is removed
    useEffect(() => {
      if (marketToRemove) {   

        // Remove from pending requests if it's there
        if (pendingRequests.current.has(marketToRemove)) {
          pendingRequests.current.delete(marketToRemove);
        }

        setData(prevData => {
          const updatedData = { ...prevData };
          delete updatedData[marketToRemove];
  
          updateDateRanges(updatedData);
          return updatedData;
        });
      }
    }, [marketToRemove]);

    // Cleanup effect
    useEffect(() => {
      return () => {
        // Clear all pending requests when component unmounts
        pendingRequests.current.clear();
      };
    }, []);

    if (Object.keys(data).length === 0) {
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
  
    /* 
    const tooltipRender = (args) => {
      let tooltipData = args.series.map((series, index) => ({
        name: series.name,
        y: args.point[index].y,
        formattedValue: formatValue(args.point[index].y)
      }));
    
      tooltipData.sort((a, b) => b.y - a.y);
      args.text = tooltipData.map(item => `${item.name}: ${item.formattedValue}`);
    };
    */ 

    const tooltipRender = (args) => {
      let tooltipData = args.series.map((series, index) => ({
        name: series.name,
        y: args.point[index].y,
        formattedValue: formatValue(args.point[index].y)
      }));
    
      // Remove the sorting line
      args.text = tooltipData.map(item => `${item.name}: ${item.formattedValue}`);
    };

  
    return (
      <ChartComponent
        id="market-Liquidity-chart"
        width = "95%"
        title={`Daily Total Liquidity by Market`}
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
  
export default LiquidityMarket;
  
