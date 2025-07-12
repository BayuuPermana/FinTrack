import React, { useState } from 'react';

const AddFundsForm = ({ onAdd, onCancel }) => {
    const [amount, setAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(parseFloat(amount));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="fund-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount to Add</label>
                <input type="number" id="fund-amount" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm" required autoFocus/>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Add Funds</button>
            </div>
        </form>
    );
};

export default AddFundsForm;
