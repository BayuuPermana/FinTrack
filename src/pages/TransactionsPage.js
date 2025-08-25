import React from 'react';
import { useData } from '../contexts/DataContext';
import Card from '../components/ui/Card';

import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import TransactionForm from '../components/forms/TransactionForm';
import formatCurrency from '../utils/formatCurrency';
import useModal from '../hooks/useModal';
import PageHeader from '../components/ui/PageHeader';
import { Edit, Trash2, ArrowRightCircle, ArrowLeftCircle } from 'lucide-react';

const TransactionsPage = () => {
    const { transactions, accounts, addTransaction, updateTransaction, deleteTransaction, loading } = useData();
    const { isOpen: isModalOpen, modalData: editingTransaction, openModal, closeModal } = useModal();
    const { isOpen: isConfirmOpen, modalData: deletingId, openModal: openConfirmModal, closeModal: closeConfirmModal } = useModal();

    const handleSaveTransaction = async (transaction) => {
        if (editingTransaction) {
            await updateTransaction(editingTransaction.id, transaction);
        } else {
            await addTransaction(transaction);
        }
        closeModal();
    };

    const handleDelete = async () => {
        if (deletingId) {
            await deleteTransaction(deletingId);
        }
        closeConfirmModal();
    };

    const sortedTransactions = [...transactions].sort((a, b) => b.date - a.date);

    const getAccountName = (accountId) => {
        const account = accounts.find(a => a.id === accountId);
        return account ? account.name : 'N/A';
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Transactions"
                buttonText="Add Transaction"
                onButtonClick={() => openModal()}
            />

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingTransaction ? "Edit Transaction" : "Add Transaction"}>
                <TransactionForm transaction={editingTransaction} onSave={handleSaveTransaction} onCancel={closeModal} />
            </Modal>
            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={closeConfirmModal}
                onConfirm={handleDelete}
                title="Delete Transaction"
                message="Are you sure you want to delete this transaction? This action cannot be undone."
            />

            <Card>
                <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 w-12"></th>
                                    <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Description</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Account</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Category</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Amount</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedTransactions.length > 0 ? sortedTransactions.map(t => (
                                    <tr key={t.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="p-4 text-center">
                                            {t.type === 'income' ? (
                                                <ArrowRightCircle className="text-green-500" size={20} />
                                            ) : (
                                                <ArrowLeftCircle className="text-red-500" size={20} />
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-700 dark:text-gray-300">{t.date.toLocaleDateString()}</td>
                                        <td className="p-4 font-medium text-gray-900 dark:text-white">{t.description}</td>
                                        <td className="p-4 text-gray-700 dark:text-gray-300">{getAccountName(t.accountId)}</td>
                                        <td className="p-4 text-gray-700 dark:text-gray-300">{t.category}</td>
                                        <td className={`p-4 font-bold text-right ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatCurrency(t.amount)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center space-x-2">
                                                <button onClick={() => openModal(t)} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"><Edit size={18} /></button>
                                                <button onClick={() => openConfirmModal(t.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="text-center p-8 text-gray-500 dark:text-gray-400">No transactions found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
            </Card>
        </div>
    );
};

export default TransactionsPage;
