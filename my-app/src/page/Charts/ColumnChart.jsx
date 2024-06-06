// ColumnComponent.js
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const ColumnComponent = ({ data }) => {
    const options = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Statistique un seul robot'
        },
        xAxis: {
            categories: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
        },
        yAxis: {
            title: {
                text: 'Nombres des pièces'
            }
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

export default ColumnComponent;
