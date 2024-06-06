import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const TopProd = () => {
  const options = {
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Top Production',
      align: 'left'
    },

    xAxis: {
      categories: ['Robot1', 'Robot2', 'Robot3', 'Robot4'],
      title: {
        text: null
      },
      gridLineWidth: 1,
      lineWidth: 0
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Population (millions)',
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      },
      gridLineWidth: 0
    },
    tooltip: {
      valueSuffix: ' Pièces'
    },
    plotOptions: {
      bar: {
        borderRadius: '50%',
        dataLabels: {
          enabled: true
        },
        groupPadding: 0.1
      }
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      x: -40,
      y: 80,
      floating: true,
      borderWidth: 1,
      backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
      shadow: true
    },
    credits: {
      enabled: false
    },
    series: [{
      name: 'Année 2020',
      data: [631, 727, 3202, 821]
    }, {
      name: 'Année 2021',
      data: [814, 841, 3714, 726]
    }, {
      name: 'Année 2022',
      data: [1276, 1007, 4561, 746]
    }]
  };

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options} height={300} width={900}
        containerProps={{ style: { height: '400px', width: '550px' , padding:'0.5rem', transition: '0.7s',
        backgroundColor: 'rgb(233, 235, 240)',
        boxShadow: '0 5px 25px rgba(220, 145, 145, 0.5)'} }}
      />
    </div>
  );
};

export default TopProd;