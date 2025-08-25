import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import Card from '../components/ui/Card';

import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import BudgetForm from '../components/forms/BudgetForm';
import formatCurrency from '../utils/formatCurrency';
import useModal from '../hooks/useModal';
import PageHeader from '../components/ui/PageHeader';
import { Edit, Trash2, Info, RefreshCw } from 'lucide-react';

const BudgetsPage = () => {
    const { budgets, transactions, addBudget, updateBudget, deleteBudget, resetBudgets, loading } = useData();
    const { isOpen: isModalOpen, modalData: editingBudget, openModal, closeModal } = useModal();
    const { isOpen: isConfirmOpen, modalData: deletingId, openModal: openConfirmModal, closeModal: closeConfirmModal } = useModal();
    const { isOpen: isResetConfirmOpen, openModal: openResetConfirmModal, closeModal: closeResetConfirmModal } = useModal();

    const monthlySpending = useMemo(() => {
        const spending = {};
        if (!budgets) return spending;
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

    const handleResetBudgets = async () => {
        await resetBudgets();
        closeResetConfirmModal();
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Budgets"
                buttonText="Add Budget"
                onButtonClick={() => openModal()}
            >
                <button 
                    onClick={() => openResetConfirmModal()}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <RefreshCw size={16} />
                    Reset Budgets
                </button>
            </PageHeader>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingBudget ? "Edit Budget" : "Add Budget"}>
                <BudgetForm budget={editingBudget} onSave={handleSaveBudget} onCancel={closeModal} />
            </Modal>
            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={closeConfirmModal}
                onConfirm={handleDelete}
                title="Delete Budget"
                message="Are you sure you want to delete this budget? This action cannot be undone."
            />
            <ConfirmModal 
                isOpen={isResetConfirmOpen}
                onClose={closeResetConfirmModal}
                onConfirm={handleResetBudgets}
                title="Reset Budgets"
                message="Are you sure you want to reset all budget amounts to zero for the new month? This action cannot be undone."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budgets.length > 0 ? budgets.map(budget => {
                        const spentAmount = monthlySpending[budget.id] || 0;
                        const progress = budget.limit > 0 ? (spentAmount / budget.limit) * 100 : 0;
                        const progressColor = progress > 100 ? 'bg-red-500' : 'bg-gradient-to-r from-sky-500 to-cyan-600';
                        
                        return (
                            <Card key={budget.id} className="flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex flex-col">
                                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{budget.name}</h2>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{budget.category}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button onClick={() => openModal(budget)} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"><Edit size={18} /></button>
                                            <button onClick={() => openConfirmModal(budget.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                    <div className="space-y-4 mt-4">
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-semibold text-gray-700 dark:text-gray-200">Spending</span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(spentAmount)} / {formatCurrency(budget.limit)}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                                <div className={`${progressColor} h-4 rounded-full`} style={{ width: `${Math.min(progress, 100)}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    }) : (
                        <div className="col-span-full text-center py-12">
                            <Info size={48} className="mx-auto text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No budgets found</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new budget.</p>
                        </div>
                    )}
                </div>
        </div>
    );
};

export default BudgetsPage;