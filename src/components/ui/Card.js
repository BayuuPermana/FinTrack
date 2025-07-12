/*
* =================================================================
* FILE: src/components/ui/Card.js
* =================================================================
*/
import React from 'react';

export const Card = ({ children, className = '' }) => (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg ${className}`}>
        {children}
    </div>
);