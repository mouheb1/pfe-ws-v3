import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const BasicAreaChart = () => {
  useEffect(() => {
    Highcharts.chart('BasicAreaChart', {
      chart: {
        type: 'area'
      },
      title: {
        text: 'Analyse un seul robot'
      },
      xAxis: {
        categories: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
        accessibility: {
          rangeDescription: 'Days'
        }
      },
      yAxis: {
        min: 0,
        max: 10000,
        title: {
          text: 'Nombres de fardeaux'
        }
      },
      tooltip: {
        pointFormat: '{series.name} avait stocké <b>{point.y:,.0f}</b><br/>fardeaux en {point.x}'
      },
      series: [{
        name: 'Le mois dernier',
        data: [3000, 4500, 5000, 7500] // Exemple de données pour chaque semaine
      }, {
        name: 'Ce mois-Ci',
        data: [2000, 6000, 7000, 7400] // Exemple de données pour chaque semaine
      }]
    });
  }, []);

  return <div id="BasicAreaChart" style={{ width: '550px', height: '400px' , padding:'0.5rem',
    transition: '0.7s',
    backgroundColor: 'rgb(233, 235, 240)',
    boxShadow: '0 5px 25px rgba(220, 145, 145, 0.5)',
    }}></div>;
};

export default BasicAreaChart;