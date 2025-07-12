import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import TransactionForm from '../components/forms/TransactionForm';
import formatCurrency from '../utils/formatCurrency';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const TransactionsPage = () => {
    const { transactions, addTransaction, updateTransaction, deleteTransaction, loading } = useData();
    const [isModalOpen, setModalOpen] = useState(false);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const handleOpenModal = (transaction = null) => {
        setEditingTransaction(transaction);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingTransaction(null);
        setModalOpen(false);
    };

    const handleSaveTransaction = async (transaction) => {
        if (editingTransaction) {
            await updateTransaction(editingTransaction.id, transaction);
        } else {
            await addTransaction(transaction);
        }
        handleCloseModal();
    };

    const openConfirmDelete = (id) => {
        setDeletingId(id);
        setConfirmOpen(true);
    };

    const handleDelete = async () => {
        if (deletingId) {
            await deleteTransaction(deletingId);
        }
        setConfirmOpen(false);
        setDeletingId(null);
    };

    const sortedTransactions = [...transactions].sort((a, b) => b.date - a.date);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Transactions</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg">
                    <PlusCircle size={20} />
                    <span>Add Transaction</span>
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTransaction ? "Edit Transaction" : "Add Transaction"}>
                <TransactionForm transaction={editingTransaction} onSave={handleSaveTransaction} onCancel={handleCloseModal} />
            </Modal>
            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Delete Transaction"
                message="Are you sure you want to delete this transaction? This action cannot be undone."
            />

            <Card>
                {loading ? <Spinner /> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Description</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Category</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Amount</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedTransactions.length > 0 ? sortedTransactions.map(t => (
                                    <tr key={t.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="p-4 text-gray-700 dark:text-gray-300">{t.date.toLocaleDateString()}</td>
                                        <td className="p-4 font-medium text-gray-900 dark:text-white">{t.description}</td>
                                        <td className="p-4 text-gray-700 dark:text-gray-300">{t.category}</td>
                                        <td className={`p-4 font-bold text-right ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                            {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center space-x-2">
                                                <button onClick={() => handleOpenModal(t)} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"><Edit size={18} /></button>
                                                <button onClick={() => openConfirmDelete(t.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="text-center p-8 text-gray-500 dark:text-gray-400">No transactions found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default TransactionsPage;
