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
  ColumnSeries,
  Crosshair
} from '@syncfusion/ej2-react-charts';

function MarketLiquidity({ id }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const colors = ["#fd7f6f", "#7eb0d5", "#b2e061", "#bd7ebe", "#ffb55a", "#ffee65", "#beb9db", "#fdcce5", "#8bd3c7"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://3.141.7.141:5000/api/overallMarketData');
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

  const chartData = data.map((item, index) => ({
    x: index,
    y: parseFloat(item.liquidity),
    question: item.question
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
      const question = chartData[args.point.index].question;
      args.text = `${question}: ${formattedValue}`;
    }
  };

  return (
    <ChartComponent
      id={id}
      title='Liquidity (USD) In Trending Markets'
      titleStyle={{
        fontFamily: 'Arial',
        fontWeight: '500',
        size: '18px'
      }}
      primaryXAxis={{
        valueType: 'Category',
        majorGridLines: { width: 0 },
        labelStyle: { visible: false }
      }}
      primaryYAxis={{
        title: 'Liquidity (USD)', 
        labelFormat: '${value}',
        majorGridLines: { width: 1, dashArray: '2,2', color: 'grey'},
        lineStyle: { color: 'black', width: 2},
        minimum: 0
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
      <Inject services={[ColumnSeries, Legend, Tooltip, DataLabel, Category, Crosshair]} />
      <SeriesCollectionDirective>
        <SeriesDirective
          dataSource={chartData}
          xName='x'
          yName='y'
          type='Column'
          columnWidth={0.8}
          columnSpacing={0.1}
        />
      </SeriesCollectionDirective>
    </ChartComponent>
  );
}

export default MarketLiquidity;