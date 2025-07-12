/*
* =================================================================
* FILE: src/pages/GoalsPage.js
* =================================================================
*/
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { formatCurrency } from '../utils/formatCurrency';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { Modal } from '../components/ui/Modal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { GoalForm } from '../components/forms/GoalForm';
import { AddFundsForm } from '../components/forms/AddFundsForm';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const GoalsPage = () => {
    const { goals, addGoal, updateGoal, deleteGoal, addFundsToGoal, loading } = useData();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [isFundsModalOpen, setFundsModalOpen] = useState(false);
    const [fundingGoal, setFundingGoal] = useState(null);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const handleOpenModal = (goal = null) => {
        setEditingGoal(goal);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingGoal(null);
        setModalOpen(false);
    };
    
    const handleOpenFundsModal = (goal) => {
        setFundingGoal(goal);
        setFundsModalOpen(true);
    };
    
    const handleCloseFundsModal = () => {
        setFundingGoal(null);
        setFundsModalOpen(false);
    };

    const handleSaveGoal = async (goal) => {
        if (editingGoal) {
            await updateGoal(editingGoal.id, goal);
        } else {
            await addGoal(goal);
        }
        handleCloseModal();
    };

    const openConfirmDelete = (id) => {
        setDeletingId(id);
        setConfirmOpen(true);
    };

    const handleDelete = async () => {
        if(deletingId) {
            await deleteGoal(deletingId);
        }
        setConfirmOpen(false);
        setDeletingId(null);
    };
    
    const handleAddFunds = async (amount) => {
        if(fundingGoal && amount > 0) {
            await addFundsToGoal(fundingGoal.id, amount);
        }
        handleCloseFundsModal();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Financial Goals</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg">
                    <PlusCircle size={20} />
                    <span>New Goal</span>
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingGoal ? "Edit Goal" : "Add New Goal"}>
                <GoalForm goal={editingGoal} onSave={handleSaveGoal} onCancel={handleCloseModal} />
            </Modal>
            
            <Modal isOpen={isFundsModalOpen} onClose={handleCloseFundsModal} title={`Add Funds to "${fundingGoal?.name}"`}>
                <AddFundsForm onAdd={handleAddFunds} onCancel={handleCloseFundsModal} />
            </Modal>

            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Delete Goal"
                message="Are you sure you want to delete this goal? This action cannot be undone."
            />

            {loading ? <Spinner /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.length > 0 ? goals.map(goal => {
                        const progress = goal.targetAmount > 0 ? ((goal.currentAmount || 0) / goal.targetAmount) * 100 : 0;
                        return (
                            <Card key={goal.id} className="flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">{goal.name}</h2>
                                        <div className="flex space-x-2">
                                           <button onClick={() => handleOpenModal(goal)} className="text-gray-400 hover:text-indigo-500"><Edit size={18} /></button>
                                           <button onClick={() => openConfirmDelete(goal.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Target: {formatCurrency(goal.targetAmount)}</p>
                                    
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300">
                                            <span>Progress</span>
                                            <span>{progress.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full" style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <p className="text-right text-sm text-gray-500 dark:text-gray-400">{formatCurrency(goal.currentAmount || 0)} saved</p>
                                    </div>
                                </div>
                                <button onClick={() => handleOpenFundsModal(goal)} className="w-full mt-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                    Add Funds
                                </button>
                            </Card>
                        );
                    }) : (
                        <Card className="md:col-span-2 lg:col-span-3 text-center py-16">
                            <p className="text-gray-500 dark:text-gray-400">You haven't set any financial goals yet. Click "New Goal" to start!</p>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};
export default GoalsPage;