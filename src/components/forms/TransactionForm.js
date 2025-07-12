/*
* =================================================================
* FILE: src/components/forms/TransactionForm.js
* =================================================================
*/
import React, { useState, useEffect } from 'react';

export const TransactionForm = ({ transaction, onSave, onCancel }) => {
    const [type, setType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (transaction) {
            setType(transaction.type);
            setAmount(transaction.amount);
            setCategory(transaction.category);
            setDate(new Date(transaction.date).toISOString().split('T')[0]);
            setDescription(transaction.description);
        } else {
            setType('expense');
            setAmount('');
            setCategory('');
            setDate(new Date().toISOString().split('T')[0]);
            setDescription('');
        }
    }, [transaction]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ type, amount: parseFloat(amount), category, date: new Date(date), description });
    };

    const expenseCategories = ["Groceries", "Rent", "Utilities", "Transport", "Entertainment", "Health", "Other"];
    const incomeCategories = ["Salary", "Bonus", "Freelance", "Investment", "Other"];
    const categories = type === 'expense' ? expenseCategories : incomeCategories;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                <div className="flex space-x-2">
                    <button type="button" onClick={() => { setType('expense'); setCategory(''); }} className={`w-full py-2 rounded-lg ${type === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Expense</button>
                    <button type="button" onClick={() => { setType('income'); setCategory(''); }} className={`w-full py-2 rounded-lg ${type === 'income' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Income</button>
                </div>
            </div>
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm" required />
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm" required>
                    <option value="">Select a category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm" required />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm" required />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Save</button>
            </div>
        </form>
    );
};