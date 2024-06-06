// PieChart.js
import React from 'react';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const PieChart = ({ totalPieces, palatizedPieces }) => {
  const options = {
    chart: {
      type: 'pie',
    },
    title: {
      text: 'Diagramme circulaire',
    },
    series: [{
      name: 'Pièces',
      data: [
        { name: 'Total Pieces', y: totalPieces - palatizedPieces, color: '#00aaff' },
        { name: 'Palatized Pieces', y: palatizedPieces, color: '#0055aa' }
      ],
    }],
    plotOptions: {
      pie: {
        dataLabels: {
          format: '{point.name}: {point.percentage:.1f}%',
        },
      },
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default PieChart;
