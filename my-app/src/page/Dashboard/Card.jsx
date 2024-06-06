import React from 'react';
import "./Card.css"

const Card = ({ icon, title, value }) => {
  return (
    <div className="card">
      <div className="card-icon">{/* Utilisez l'icône correspondante à partir de la bibliothèque d'icônes */}</div>
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
    </div>
  );
};

export default Card;