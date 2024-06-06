// AreaComponent.jsx
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const AreaComponent = ({ data }) => {
    const options = {
        chart: {
            type: 'area'
        },
        title: {
            text: 'Analyse un seul robot'
        },
        xAxis: {
            categories: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4']
        },
        yAxis: {
            title: {
                text: 'Nombres de fardeaux'
            }
        },
        tooltip: {
            shared: true,
            valueSuffix: ' fardeaux'
        },
        series: [
            {
                name: 'Le mois dernier',
                data: data.previousMonth,
                color: '#00aaff'
            },
            {
                name: 'Ce mois-ci',
                data: data.currentMonth,
                color: '#0055aa'
            }
        ]
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default AreaComponent;
