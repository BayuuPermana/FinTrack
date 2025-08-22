import React, { useState, useEffect } from 'react';

const AccountForm = ({ onSave, onCancel, account }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (account) {
            setName(account.name);
        }
    }, [account]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, balance: 0 });
        setName('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm dark:text-white"
                    required
                />
            </div>
            <div className="flex justify-end space-x-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700">Save</button>
            </div>
        </form>
    );
};

export default AccountForm;
