import React from 'react';
import { useData } from '../contexts/DataContext';
import Card from '../components/ui/Card';

import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import AccountForm from '../components/forms/AccountForm';
import formatCurrency from '../utils/formatCurrency';
import useModal from '../hooks/useModal';
import PageHeader from '../components/ui/PageHeader';
import { Edit, Trash2, Info } from 'lucide-react';

const AccountsPage = () => {
    const { accounts, addAccount, updateAccount, deleteAccount, loading } = useData();
    const { isOpen: isModalOpen, modalData: editingAccount, openModal, closeModal } = useModal();
    const { isOpen: isConfirmOpen, modalData: deletingId, openModal: openConfirmModal, closeModal: closeConfirmModal } = useModal();

    const handleSaveAccount = async (account) => {
        if (editingAccount) {
            await updateAccount(editingAccount.id, account);
        } else {
            await addAccount(account);
        }
        closeModal();
    };

    const handleDelete = async () => {
        if (deletingId) {
            await deleteAccount(deletingId);
        }
        closeConfirmModal();
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Accounts"
                buttonText="Add Account"
                onButtonClick={() => openModal()}
            />

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingAccount ? "Edit Account" : "Add Account"}>
                <AccountForm account={editingAccount} onSave={handleSaveAccount} onCancel={closeModal} />
            </Modal>
            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={closeConfirmModal}
                onConfirm={handleDelete}
                title="Delete Account"
                message="Are you sure you want to delete this account? This action cannot be undone."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accounts.length > 0 ? accounts.map(account => (
                        <Card key={account.id} className="flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">{account.name}</h2>
                                    <div className="flex space-x-2">
                                        <button onClick={() => openModal(account)} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"><Edit size={18} /></button>
                                        <button onClick={() => openConfirmModal(account.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(account.balance)}</p>
                            </div>
                        </Card>
                    )) : (
                        <div className="col-span-full text-center py-12">
                            <Info size={48} className="mx-auto text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No accounts found</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new account.</p>
                        </div>
                    )}
                </div>
        </div>
    );
};

export default AccountsPage;