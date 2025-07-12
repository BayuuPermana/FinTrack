import React from 'react';

const Card = ({ children, className = '' }) => (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg ${className}`}>
        {children}
    </div>
);

export default Card;
