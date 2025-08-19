import React, { useState, useEffect } from 'react';

const AccountForm = ({ account, onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [balance, setBalance] = useState('');

    useEffect(() => {
        if (account) {
            setName(account.name);
            setBalance(account.balance);
        } else {
            setName('');
            setBalance('');
        }
    }, [account]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, balance: parseFloat(balance) });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Account Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="balance" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Initial Balance</label>
                <input
                    type="number"
                    id="balance"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                    required
                />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700">Save Account</button>
            </div>
        </form>
    );
};

export default AccountForm;
