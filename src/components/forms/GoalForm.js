/*
* =================================================================
* FILE: src/components/forms/GoalForm.js
* =================================================================
*/
import React, { useState, useEffect } from 'react';

export const GoalForm = ({ goal, onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currentAmount, setCurrentAmount] = useState('0');

    useEffect(() => {
        if (goal) {
            setName(goal.name);
            setTargetAmount(goal.targetAmount);
            setCurrentAmount(goal.currentAmount || 0);
        } else {
            setName('');
            setTargetAmount('');
            setCurrentAmount('0');
        }
    }, [goal]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, targetAmount: parseFloat(targetAmount), currentAmount: parseFloat(currentAmount) });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="goal-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Goal Name</label>
                <input type="text" id="goal-name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm" required />
            </div>
            <div>
                <label htmlFor="target-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target Amount</label>
                <input type="number" id="target-amount" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm" required />
            </div>
            <div>
                <label htmlFor="current-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Amount</label>
                <input type="number" id="current-amount" value={currentAmount} onChange={e => setCurrentAmount(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm" required />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Save Goal</button>
            </div>
        </form>
    );
};