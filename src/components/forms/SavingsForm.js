import React, { useState, useEffect } from 'react';

const SavingsForm = ({ savings, onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [institution, setInstitution] = useState('');
    const [currentAmount, setCurrentAmount] = useState('');
    const [targetAmount, setTargetAmount] = useState('');

    useEffect(() => {
        if (savings) {
            setName(savings.name);
            setInstitution(savings.institution);
            setCurrentAmount(savings.currentAmount);
            setTargetAmount(savings.targetAmount || '');
        } else {
            setName('');
            setInstitution('');
            setCurrentAmount('');
            setTargetAmount('');
        }
    }, [savings]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ 
            name, 
            institution,
            currentAmount: parseFloat(currentAmount), 
            targetAmount: targetAmount ? parseFloat(targetAmount) : 0 
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="savings-name" className="block text-sm font-medium text-gray-700 dark:text-white">Account Name</label>
                <input type="text" id="savings-name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm" required required />
            </div>
            <div>
                <label htmlFor="institution" className="block text-sm font-medium text-gray-700 dark:text-white">Financial Institution</label>
                <input type="text" id="institution" value={institution} onChange={e => setInstitution(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm" required />
            </div>
            <div>
                <label htmlFor="current-amount" className="block text-sm font-medium text-gray-700 dark:text-white">Current Amount</label>
                <input type="number" id="current-amount" value={currentAmount} onChange={e => setCurrentAmount(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm" required required />
            </div>
            <div>
                <label htmlFor="target-amount" className="block text-sm font-medium text-gray-700 dark:text-white">Target Amount (Optional)</label>
                <input type="number" id="target-amount" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm" required />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-lg">Save Account</button>
            </div>
        </form>
    );
};

export default SavingsForm;
