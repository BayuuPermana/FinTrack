import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';

const BudgetForm = ({ budget, onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');
    const [category, setCategory] = useState('');
    const { transactions, expenseCategories } = useData();

    

    useEffect(() => {
        if (budget) {
            setName(budget.name);
            setLimit(budget.limit);
            setCategory(budget.category);
        } else {
            setName('');
            setLimit('');
            setCategory(expenseCategories.length > 0 ? expenseCategories[0] : '');
        }
    }, [budget, expenseCategories]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, limit: parseFloat(limit), category });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="budget-name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Budget Name</label>
                <input type="text" id="budget-name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-500 dark:bg-gray-800 dark:text-white shadow-sm" required />
            </div>
            <div>
                <label htmlFor="limit" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Limit</label>
                <input type="number" id="limit" value={limit} onChange={e => setLimit(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-500 dark:bg-gray-800 dark:text-white shadow-sm" required />
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Category</label>
                <select 
                    id="category" 
                    value={category} 
                    onChange={e => setCategory(e.target.value)} 
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-500 dark:bg-gray-800 dark:text-white shadow-sm" 
                    required
                >
                    <option value="" disabled>Select a category</option>
                    {expenseCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Save Budget</button>
            </div>
        </form>
    );
};

export default BudgetForm;