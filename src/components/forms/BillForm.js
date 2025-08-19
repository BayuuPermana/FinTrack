import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';

const BillForm = ({ bill, onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [accountId, setAccountId] = useState('');
    const { accounts } = useData();

    useEffect(() => {
        if (bill) {
            setName(bill.name);
            setAmount(bill.amount);
            setDueDate(new Date(bill.dueDate).toISOString().split('T')[0]);
            setCategory(bill.category);
            setIsRecurring(bill.isRecurring || false);
            setAccountId(bill.accountId || (accounts.length > 0 ? accounts[0].id : ''));
        } else {
            setName('');
            setAmount('');
            setDueDate(new Date().toISOString().split('T')[0]);
            setCategory('');
            setIsRecurring(false);
            setAccountId(accounts.length > 0 ? accounts[0].id : '');
        }
    }, [bill, accounts]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, amount: parseFloat(amount), dueDate: new Date(dueDate), category, isRecurring, accountId, isPaid: bill ? bill.isPaid : false });
    };

    const categories = ["Rent", "Utilities", "Subscription", "Loan", "Insurance", "Other"];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="bill-name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Bill Name</label>
                <input type="text" id="bill-name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-500 dark:bg-gray-800 dark:text-white shadow-sm" required />
            </div>
            <div>
                <label htmlFor="bill-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Amount</label>
                <input type="number" id="bill-amount" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-500 dark:bg-gray-800 dark:text-white shadow-sm" required />
            </div>
            <div>
                <label htmlFor="bill-category" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Category</label>
                <select id="bill-category" value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-500 dark:bg-gray-800 dark:text-white shadow-sm" required>
                    <option value="">Select a category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="account" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Account</label>
                <select
                    id="account"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-500 dark:bg-gray-800 dark:text-white shadow-sm"
                    required
                >
                    {accounts.map(account => (
                        <option key={account.id} value={account.id}>{account.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="bill-due-date" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Due Date</label>
                <input type="date" id="bill-due-date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-500 dark:bg-gray-800 dark:text-white shadow-sm" required />
            </div>
            <div className="flex items-center">
                <input id="is-recurring" type="checkbox" checked={isRecurring} onChange={e => setIsRecurring(e.target.checked)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                <label htmlFor="is-recurring" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">This is a recurring bill</label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Save Bill</button>
            </div>
        </form>
    );
};

export default BillForm;