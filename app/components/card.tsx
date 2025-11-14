import React from "react";

interface CardProps {
  name: string;
  url: string;
}

const Card: React.FC<CardProps> = ({ name, url }) => {
  return (
    <div className="card">
      <img src={url} alt={name} className="card-image" />
      <h2 className="card-title">{name}</h2>
    </div>
  );
};

export default Card;
