import React, { useState, handleChange, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { state } from '../../states/global.state';
import { serviceRobot } from '../../services/http-client.service';

const Historigram = () => {
    const [options, setOptions] = useState({
        chart: {
            type: 'bar',
            padding: '3rem',
        },
        xaxis: {
            categories: ['Robot 1', 'Robot 2', 'Robot 3', 'Robot 4', 'Robot 5'],
        },
        title: {
            text: 'Pourcentage de pièces palettisées par robot',
            align: 'center',
            
        },
    });

    const [series, setSeries] = useState([
        {
            name: 'Pourcentage',
            data: [30, 40, 50, 60, 70],
            
        }
    ]); 
    const updateData = async (data_) => { 
        if (data_) {
            const categories = data_.map(robot => robot.name);
            const seriesData = data_.map(robot => robot.totalPiecesPalatize);

            setOptions(prevOptions => ({
                ...prevOptions,
                xaxis: {
                    categories: categories,
                }
            }));
            setSeries([{
                name: 'Pourcentage',
                data: seriesData,
            }]);
        }
    };

    const fetchData = async () => {
        try {
          const jsonData = await serviceRobot.selectAll(); // Convertir la réponse en JSON
          state.dataColumns = jsonData.map(robot => ({
            name: robot.reference,
            totalPiecesPalatize: robot.totalPiecesPalatize
        }));   
        updateData(  state.dataColumns);  
        } catch (error) {
          console.error('Error fetching data:', error); 
        }
      };
    const handleMessageTwo = (dataSTR) => {  
        try {
            const dataJson = JSON.parse(dataSTR); 
            if ( ! dataJson.hasOwnProperty('mode')) { console.error('Cant found mode'); return ; } 
            if (dataJson.mode ==  "data") { 
                if (  !dataJson.hasOwnProperty('content')|| !dataJson.content.hasOwnProperty('totalPieces')) {console.error('Cant found content or totalPieces'); return ;}
             

            

                    let  newdata = [];
                    const index =   state.dataColumns.findIndex(item => item.name === dataJson.content.reference);
                    if (index !== -1) {
                        const updatedArray = [...  state.dataColumns];
                        updatedArray[index].totalPiecesPalatize  = updatedArray[index].totalPiecesPalatize + parseFloat( dataJson.content.totalPieces);
                        newdata =  updatedArray;
                    } else {
                        newdata =  [...  state.dataColumns, {name:   dataJson.content.reference, totalPiecesPalatize:   parseFloat( dataJson.content.totalPieces)}];
                    }
                    state.dataColumns = newdata; 
                    updateData(newdata); 
            }

          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
    };


    useEffect(() => {  
   
        state.wsClient.addMessageListener(handleMessageTwo);
        fetchData();
        return () => {
        state.wsClient.removeMessageListener(handleMessageTwo);
        };
      }, []);




    return (
        <div style={{
            transition: '0.7s',
            backgroundColor: 'rgb(233, 235, 240)',
            boxShadow: '0 5px 25px rgba(220, 145, 145, 0.5)',
            }}>
        {/* <Select onChange={handleChange} defaultValue="Le mois dernier">
            <MenuItem value="Aujourd'hui">Aujourd'hui</MenuItem>
            <MenuItem value="La semaine dernière">La semaine dernière</MenuItem>
            <MenuItem value="Le mois dernier">Le mois dernier</MenuItem>
        </Select> */}
        <Chart options={options} series={series} type="bar" height={300} width={1100}   />
    </div>
    );
};

export default Historigram;
