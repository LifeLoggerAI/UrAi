import React from 'react';

const Card = ({ children, header }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg">
      {header && <div className="p-4 border-b border-white/10">{header}</div>}
      <div className="p-4">{children}</div>
    </div>
  );
};

export default Card;
