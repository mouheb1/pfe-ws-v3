import React, { useEffect } from 'react';
import Highcharts from 'highcharts';

const StatistiqueChart = () => {
  useEffect(() => {
    Highcharts.chart('container1', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Statistique un seul robot ',
        align: 'left'
      },
      subtitle: {
        
        align: 'left'
      },
      xAxis: {
        categories: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        crosshair: true,
        accessibility: {
          description: 'Days'
        }
      },
      yAxis: {
        min: 0,
        max: 10000, // Réglez la valeur maximale de l'axe des ordonnées à 1000
        title: {
          text: 'Nombres des pièces'
        }
      },
      tooltip: {
        valueSuffix: ' (10000 Fardeaux)'
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [
        {
          name: 'Le mois dernier',
          data: [4062, 2600, 1070, 6830, 2750, 1450]
        },
        {
          name: 'Ce mois-ci',
          data: [5108, 1360, 5500, 1410, 1071, 7700]
        }
      ]
    });
  }, []);

  return <div id="container1"  style={{ width: '550px', height: '400px' , padding:'0.5rem',
  transition: '0.7s',
  backgroundColor: 'rgb(233, 235, 240)',
  boxShadow: '0 5px 25px rgba(220, 145, 145, 0.5)', 
  }}></div>;
};

export default StatistiqueChart;
