/*
* =================================================================
* FILE: src/pages/BillsPage.js
* =================================================================
*/
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { formatCurrency } from '../utils/formatCurrency';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { Modal } from '../components/ui/Modal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { BillForm } from '../components/forms/BillForm';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const BillsPage = () => {
    const { bills, addBill, updateBill, deleteBill, toggleBillPaidStatus, loading } = useData();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingBill, setEditingBill] = useState(null);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const handleOpenModal = (bill = null) => {
        setEditingBill(bill);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingBill(null);
        setModalOpen(false);
    };

    const handleSaveBill = async (bill) => {
        if (editingBill) {
            await updateBill(editingBill.id, bill);
        } else {
            await addBill(bill);
        }
        handleCloseModal();
    };

    const openConfirmDelete = (id) => {
        setDeletingId(id);
        setConfirmOpen(true);
    };

    const handleDelete = async () => {
        if (deletingId) {
            await deleteBill(deletingId);
        }
        setConfirmOpen(false);
        setDeletingId(null);
    };

    const handlePayBill = async (bill) => {
        await toggleBillPaidStatus(bill.id, !bill.isPaid);
        if (bill.isRecurring && !bill.isPaid) {
            const newDueDate = new Date(bill.dueDate);
            newDueDate.setMonth(newDueDate.getMonth() + 1);
            const nextBill = { ...bill, dueDate: newDueDate, isPaid: false };
            delete nextBill.id;
            await addBill(nextBill);
        }
    };

    const upcomingBills = bills.filter(b => !b.isPaid).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    const paidBills = bills.filter(b => b.isPaid).sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Bill Management</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg">
                    <PlusCircle size={20} />
                    <span>Add Bill</span>
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingBill ? "Edit Bill" : "Add New Bill"}>
                <BillForm bill={editingBill} onSave={handleSaveBill} onCancel={handleCloseModal} />
            </Modal>
            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Delete Bill"
                message="Are you sure you want to delete this bill? This action cannot be undone."
            />

            {loading ? <Spinner /> : (
                <div className="space-y-8">
                    <Card>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Upcoming Bills</h2>
                        {upcomingBills.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingBills.map(bill => (
                                    <div key={bill.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <button onClick={() => handlePayBill(bill)} className="w-6 h-6 border-2 border-orange-500 rounded-full flex-shrink-0"></button>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">{bill.name}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{bill.category} {bill.isRecurring && "(Recurring)"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <p className="font-bold text-lg text-orange-500">{formatCurrency(bill.amount)}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                                            </div>
                                            <button onClick={() => handleOpenModal(bill)} className="text-gray-400 hover:text-indigo-500"><Edit size={18} /></button>
                                            <button onClick={() => openConfirmDelete(bill.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-center text-gray-500 dark:text-gray-400 py-8">No upcoming bills. Great job!</p>}
                    </Card>
                    <Card>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Paid Bills</h2>
                         {paidBills.length > 0 ? (
                            <div className="space-y-4">
                                {paidBills.map(bill => (
                                    <div key={bill.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg opacity-60">
                                        <div className="flex items-center space-x-4">
                                            <button onClick={() => handlePayBill(bill)} className="w-6 h-6 border-2 border-green-500 bg-green-500 rounded-full flex-shrink-0 flex items-center justify-center text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                            </button>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white line-through">{bill.name}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{bill.category}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg text-green-500 line-through">{formatCurrency(bill.amount)}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Paid: {new Date(bill.dueDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-center text-gray-500 dark:text-gray-400 py-8">No paid bills recorded yet.</p>}
                    </Card>
                </div>
            )}
        </div>
    );
};
export default BillsPage;