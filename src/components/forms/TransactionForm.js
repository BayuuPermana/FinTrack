import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';

const TransactionForm = ({ transaction, onSave, onCancel }) => {
    const [type, setType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [accountId, setAccountId] = useState('');
    const { accounts } = useData();

    useEffect(() => {
        if (transaction) {
            setType(transaction.type);
            setAmount(transaction.amount);
            setDate(new Date(transaction.date).toISOString().split('T')[0]);
            setDescription(transaction.description);
            setCategory(transaction.category);
            setAccountId(transaction.accountId);
        } else {
            setType('expense');
            setAmount('');
            setDate(new Date().toISOString().split('T')[0]);
            setDescription('');
            setCategory('');
            setAccountId(accounts.length > 0 ? accounts[0].id : '');
        }
    }, [transaction, accounts]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ type, amount: parseFloat(amount), date: new Date(date), description, category, accountId });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Type</label>
                <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
            </div>
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Amount</label>
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Date</label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
                <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Category</label>
                <input
                    type="text"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="accountId" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Account</label>
                <select
                    id="accountId"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                    required
                >
                    {accounts.map(account => (
                        <option key={account.id} value={account.id}>{account.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700">Save Transaction</button>
            </div>
        </form>
    );
};

export default TransactionForm;
