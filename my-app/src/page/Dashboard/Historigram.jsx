import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const Historigram = ({ data }) => {
    const [chartData, setChartData] = useState({
        options: {
            chart: {
                type: 'bar',
                padding: '3rem',
            },
            xaxis: {
                categories: [],
            },
            title: {
                text: 'Pourcentage de pièces palettisées par robot',
                align: 'center',
            },
        },
        series: [
            {
                name: 'Pourcentage',
                data: [],
            }
        ]
    });

    useEffect(() => {
        if (data && data.robotInfo && data.robotInfo.length > 0) {
            const categories = data.robotInfo.map(robot => robot.reference);
            const seriesData = data.robotInfo.map(robot => {
                const percentage = (robot.palatizedPieces / robot.totalPieces) * 100 || 0;
                return parseFloat(percentage.toFixed(2)); // Limit decimal places to 2
            });

            setChartData({
                options: {
                    ...chartData.options,
                    xaxis: {
                        categories: categories,
                    },
                },
                series: [{
                    name: 'Pourcentage',
                    data: seriesData,
                }]
            });
        }
    }, [data, JSON.stringify(chartData.options || '{}')]);

    return (
        <div style={{
            transition: '0.7s',
            backgroundColor: 'rgb(233, 235, 240)',
            boxShadow: '0 5px 25px rgba(220, 145, 145, 0.5)',
        }}>
            <Chart options={chartData.options} series={chartData.series} type="bar" height={300} width={1100} />
        </div>
    );
};

export default Historigram;
