import React from 'react';
import {useNavigate} from "react-router-dom"
import roboticone from '../roboticone.png';

const RobotSlot = ({ reference }) => {
  const navigate = useNavigate();
  
  const getRobotStats = () => {
    navigate(`/Statistiques/${reference}`)
  }
  return (
    <div className="grid-item" onClick={getRobotStats}>
      <div className="dash-card">
        <img src={roboticone} alt={`Robot ${reference}`} />
        <span>Robot: {reference}</span>
      </div>
      <div className="slot-buttons">
        {/* <button className="stats-button">Statistiques</button> */}
        {/* <button className="history-button">Historique</button> */}
      </div>
    </div>
  );
};

export default RobotSlot;