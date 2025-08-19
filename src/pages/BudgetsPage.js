import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import BudgetForm from '../components/forms/BudgetForm';
import formatCurrency from '../utils/formatCurrency';
import useModal from '../hooks/useModal';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const BudgetsPage = () => {
    const { budgets, transactions, addBudget, updateBudget, deleteBudget, loading } = useData();
    const { isOpen: isModalOpen, modalData: editingBudget, openModal, closeModal } = useModal();
    const { isOpen: isConfirmOpen, modalData: deletingId, openModal: openConfirmModal, closeModal: closeConfirmModal } = useModal();

    const handleSaveBudget = async (budget) => {
        if (editingBudget) {
            await updateBudget(editingBudget.id, budget);
        } else {
            await addBudget(budget);
        }
        closeModal();
    };

    const handleDelete = async () => {
        if (deletingId) {
            await deleteBudget(deletingId);
        }
        closeConfirmModal();
    };

    const monthlySpending = useMemo(() => {
        const spending = {};
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        budgets.forEach(budget => {
            const spent = transactions
                .filter(t => 
                    t.category === budget.category &&
                    t.type === 'expense' &&
                    new Date(t.date).getMonth() === currentMonth &&
                    new Date(t.date).getFullYear() === currentYear
                )
                .reduce((sum, t) => sum + t.amount, 0);
            spending[budget.id] = spent;
        });
        return spending;
    }, [transactions, budgets]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Monthly Budgets</h1>
                <button onClick={() => openModal()} className="flex items-center space-x-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 shadow-lg">
                    <PlusCircle size={20} />
                    <span>New Budget</span>
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingBudget ? "Edit Budget" : "Add New Budget"}>
                <BudgetForm 
                    budget={editingBudget} 
                    onSave={handleSaveBudget} 
                    onCancel={closeModal}
                />
            </Modal>

            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={closeConfirmModal}
                onConfirm={handleDelete}
                title="Delete Budget"
                message="Are you sure you want to delete this budget? This action cannot be undone."
            />

            {loading ? <Spinner /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budgets.length > 0 ? budgets.map(budget => {
                        const spentAmount = monthlySpending[budget.id] || 0;
                        const progress = budget.limit > 0 ? (spentAmount / budget.limit) * 100 : 0;
                        const progressColor = progress > 100 ? 'bg-red-500' : 'bg-gradient-to-r from-sky-500 to-cyan-600';

                        return (
                            <Card key={budget.id} className="flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">{budget.name}</h2>
                                        <div className="flex space-x-2">
                                           <button onClick={() => openModal(budget)} className="text-gray-400 hover:text-sky-500"><Edit size={18} /></button>
                                           <button onClick={() => openConfirmModal(budget.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Category: {budget.category}</p>
                                    
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300">
                                            <span>Spent</span>
                                            <span>{progress.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                            <div className={`${progressColor} h-3 rounded-full`} style={{ width: `${Math.min(progress, 100)}%` }}></div>
                                        </div>
                                        <p className="text-right text-sm text-gray-500 dark:text-gray-400">
                                            {formatCurrency(spentAmount)} of {formatCurrency(budget.limit)}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        );
                    }) : (
                        <Card className="md:col-span-2 lg:col-span-3 text-center py-16">
                            <p className="text-gray-500 dark:text-gray-400">You haven't set any budgets yet. Click "New Budget" to start!</p>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};

export default BudgetsPage;
