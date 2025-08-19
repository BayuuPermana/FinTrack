import React from 'react';
import { PlusCircle } from 'lucide-react';

const PageHeader = ({ title, buttonText, onButtonClick }) => {
    return (
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{title}</h1>
            <button onClick={onButtonClick} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg">
                <PlusCircle size={20} />
                <span>{buttonText}</span>
            </button>
        </div>
    );
};

export default PageHeader;
