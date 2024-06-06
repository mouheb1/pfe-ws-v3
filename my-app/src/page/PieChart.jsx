import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './PieChart.css';

const PieChart = () => {
    useEffect(() => {
        Highcharts.chart('pie-chart', {
            chart: {
                type: 'pie'
            },
            title: {
                text: 'Diagramme circulaire'
            },
            tooltip: {
                valueSuffix: '%'
            },
           
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        distance: 20,
                        format: '{point.percentage:.1f}%',
                        style: {
                            fontSize: '1.2em',
                            textOutline: 'none',
                            opacity: 0.7
                        },
                        filter: {
                            operator: '>',
                            property: 'percentage',
                            value: 10
                        }
                    }
                }
            },
            series: [{
                name: 'Percentage',
                colorByPoint: true,
                data: [{
                    name: 'Pièces palattisées',
                    y: 70.02
                }, {
                    name: 'pièces non palattisées',
                    sliced: true,
                    selected: true,
                    y: 29.08
                },
                
            ]
            }]
        });
    }, []);

    return (
        <div id="pie-chart" style={{ width: '550px', height: '400px' , padding:'0.5rem',
        transition: '0.7s',
        backgroundColor: 'rgb(233, 235, 240)',
        boxShadow: '0 5px 25px rgba(220, 145, 145, 0.5)', 
        }}>
            <HighchartsReact highcharts={Highcharts} />
        </div>
       
    );
};

export default PieChart;