import React from 'react';
import { useData } from '../contexts/DataContext';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import SavingsForm from '../components/forms/SavingsForm';
import formatCurrency from '../utils/formatCurrency';
import useModal from '../hooks/useModal';
import { PlusCircle, Edit, Trash2, PiggyBank } from 'lucide-react';

const SavingsPage = () => {
    const { savings, addSavings, updateSavings, deleteSavings, loading } = useData();
    const { isOpen: isModalOpen, modalData: editingSavings, openModal, closeModal } = useModal();
    const { isOpen: isConfirmOpen, modalData: deletingId, openModal: openConfirmModal, closeModal: closeConfirmModal } = useModal();

    const handleSaveSavings = async (savingsAccount) => {
        if (editingSavings) {
            await updateSavings(editingSavings.id, savingsAccount);
        } else {
            await addSavings(savingsAccount);
        }
        closeModal();
    };

    const handleDelete = async () => {
        if (deletingId) {
            await deleteSavings(deletingId);
        }
        closeConfirmModal();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Savings Accounts</h1>
                <button onClick={() => openModal()} className="flex items-center space-x-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 shadow-lg">
                    <PlusCircle size={20} />
                    <span>New Savings Account</span>
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingSavings ? "Edit Savings Account" : "Add New Savings Account"}>
                <SavingsForm 
                    savings={editingSavings} 
                    onSave={handleSaveSavings} 
                    onCancel={closeModal}
                />
            </Modal>

            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={closeConfirmModal}
                onConfirm={handleDelete}
                title="Delete Savings Account"
                message="Are you sure you want to delete this savings account? This action cannot be undone."
            />

            {loading ? <Spinner /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savings && savings.length > 0 ? savings.map(account => {
                        const progress = account.targetAmount > 0 ? (account.currentAmount / account.targetAmount) * 100 : 0;
                        return (
                            <Card key={account.id} className="flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center space-x-3">
                                            <PiggyBank size={24} className="text-sky-500" />
                                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{account.name}</h2>
                                        </div>
                                        <div className="flex space-x-2">
                                           <button onClick={() => openModal(account)} className="text-gray-400 hover:text-sky-500"><Edit size={18} /></button>
                                           <button onClick={() => openConfirmModal(account.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Institution: {account.institution}</p>
                                    
                                    <div className="space-y-2 mb-4">
                                        <div className="text-center my-4">
                                            <p className="text-3xl font-bold text-gray-800 dark:text-white">{formatCurrency(account.currentAmount)}</p>
                                            {account.targetAmount > 0 && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Target: {formatCurrency(account.targetAmount)}
                                                </p>
                                            )}
                                        </div>
                                        {account.targetAmount > 0 && (
                                            <div>
                                                <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300">
                                                    <span>Progress</span>
                                                    <span>{progress.toFixed(1)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                                    <div className="bg-gradient-to-r from-sky-500 to-cyan-600 h-3 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    }) : (
                        <Card className="md:col-span-2 lg:col-span-3 text-center py-16">
                            <p className="text-gray-500 dark:text-gray-400">You haven't added any savings accounts yet. Click "New Savings Account" to start!</p>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};

export default SavingsPage;
