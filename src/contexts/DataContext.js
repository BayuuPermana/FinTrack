import React, { useState, useEffect, createContext, useContext } from 'react';
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query, writeBatch } from 'firebase/firestore';
import { db, appId } from '../firebase/config';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [goals, setGoals] = useState([]);
    const [bills, setBills] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [savings, setSavings] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setTransactions([]);
            setGoals([]);
            setBills([]);
            setBudgets([]);
            setSavings([]);
            setAccounts([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        const collections = {
            transactions: setTransactions,
            goals: setGoals,
            bills: setBills,
            budgets: setBudgets,
            savings: setSavings,
            accounts: setAccounts,
        };

        const unsubscribes = Object.entries(collections).map(([name, setter]) => {
            const q = query(collection(db, `artifacts/${appId}/users/${user.uid}/${name}`));
            return onSnapshot(q, (snapshot) => {
                const items = snapshot.docs.map(doc => ({ 
                    id: doc.id, 
                    ...doc.data(),
                    date: doc.data().date?.toDate ? doc.data().date.toDate() : (doc.data().date ? new Date(doc.data().date) : null)
                }));
                setter(items);
            });
        });

        setLoading(false);

        return () => unsubscribes.forEach(unsub => unsub());
    }, [user, appId]);

    const createItem = (collectionName) => async (item) => {
        if (!user) return;
        try {
            const docRef = await addDoc(collection(db, `artifacts/${appId}/users/${user.uid}/${collectionName}`), item);
            return docRef.id;
        } catch (error) {
            console.error("Error creating item in ", collectionName, error);
            throw error;
        }
    };

    const updateItem = (collectionName) => async (id, updatedItem) => {
        if (!user) return;
        await updateDoc(doc(db, `artifacts/${appId}/users/${user.uid}/${collectionName}`, id), updatedItem);
    };

    const deleteItem = (collectionName) => async (id) => {
        if (!user) return;
        await deleteDoc(doc(db, `artifacts/${appId}/users/${user.uid}/${collectionName}`, id));
    };

    const addTransaction = async (transaction) => {
        if (!user) return;
        const batch = writeBatch(db);
        const transactionRef = doc(collection(db, `artifacts/${appId}/users/${user.uid}/transactions`));
        
        const accountRef = doc(db, `artifacts/${appId}/users/${user.uid}/accounts`, transaction.accountId);
        const account = accounts.find(a => a.id === transaction.accountId);
        const currentBalance = parseFloat(account.balance) || 0;
        const transactionAmount = parseFloat(transaction.amount) || 0;
        const newBalance = transaction.type === 'income' ? currentBalance + transactionAmount : currentBalance - transactionAmount;
        batch.update(accountRef, { balance: newBalance });

        batch.set(transactionRef, transaction);
        await batch.commit();
    };

    const updateTransaction = async (id, updatedTransaction) => {
        if (!user) return;
        const batch = writeBatch(db);
        const transactionRef = doc(db, `artifacts/${appId}/users/${user.uid}/transactions`, id);
        const oldTransaction = transactions.find(t => t.id === id);

        const oldTransactionAmount = parseFloat(oldTransaction.amount) || 0;
        const updatedTransactionAmount = parseFloat(updatedTransaction.amount) || 0;

        // If account is the same
        if (oldTransaction.accountId === updatedTransaction.accountId) {
            const accountRef = doc(db, `artifacts/${appId}/users/${user.uid}/accounts`, oldTransaction.accountId);
            const account = accounts.find(a => a.id === oldTransaction.accountId);
            const currentBalance = parseFloat(account.balance) || 0;

            // Revert old transaction
            const balanceAfterRevert = oldTransaction.type === 'income' ? currentBalance - oldTransactionAmount : currentBalance + oldTransactionAmount;
            // Apply new transaction
            const newBalance = updatedTransaction.type === 'income' ? balanceAfterRevert + updatedTransactionAmount : balanceAfterRevert - updatedTransactionAmount;

            batch.update(accountRef, { balance: newBalance });
        } else { // If account has changed
            // Revert old transaction from old account
            const oldAccountRef = doc(db, `artifacts/${appId}/users/${user.uid}/accounts`, oldTransaction.accountId);
            const oldAccount = accounts.find(a => a.id === oldTransaction.accountId);
            const oldAccountBalance = parseFloat(oldAccount.balance) || 0;
            const revertedBalance = oldTransaction.type === 'income' ? oldAccountBalance - oldTransactionAmount : oldAccountBalance + oldTransactionAmount;
            batch.update(oldAccountRef, { balance: revertedBalance });

            // Apply new transaction to new account
            const newAccountRef = doc(db, `artifacts/${appId}/users/${user.uid}/accounts`, updatedTransaction.accountId);
            const newAccount = accounts.find(a => a.id === updatedTransaction.accountId);
            const newAccountBalance = parseFloat(newAccount.balance) || 0;
            const newBalance = updatedTransaction.type === 'income' ? newAccountBalance + updatedTransactionAmount : newAccountBalance - updatedTransactionAmount;
            batch.update(newAccountRef, { balance: newBalance });
        }

        batch.update(transactionRef, updatedTransaction);
        await batch.commit();
    };

    const deleteTransaction = async (id) => {
        if (!user) return;
        const batch = writeBatch(db);
        const transactionRef = doc(db, `artifacts/${appId}/users/${user.uid}/transactions`, id);
        const transaction = transactions.find(t => t.id === id);

        const accountRef = doc(db, `artifacts/${appId}/users/${user.uid}/accounts`, transaction.accountId);
        const account = accounts.find(a => a.id === transaction.accountId);
        const currentBalance = parseFloat(account.balance) || 0;
        const transactionAmount = parseFloat(transaction.amount) || 0;
        const newBalance = transaction.type === 'income' ? currentBalance - transactionAmount : currentBalance + transactionAmount;
        batch.update(accountRef, { balance: newBalance });

        batch.delete(transactionRef);
        await batch.commit();
    };

    const addGoal = createItem('goals');
    const updateGoal = updateItem('goals');
    const deleteGoal = deleteItem('goals');
    const addBill = createItem('bills');
    const updateBill = updateItem('bills');
    const deleteBill = deleteItem('bills');
    const addBudget = createItem('budgets');
    const updateBudget = updateItem('budgets');
    const deleteBudget = deleteItem('budgets');
    const addSavings = createItem('savings');
    const updateSavings = updateItem('savings');
    const deleteSavings = deleteItem('savings');
    const addAccount = createItem('accounts');
    const updateAccount = updateItem('accounts');
    
    const deleteAccount = async (id) => {
        if (!user) return;
        const batch = writeBatch(db);
        const accountRef = doc(db, `artifacts/${appId}/users/${user.uid}/accounts`, id);
        batch.delete(accountRef);

        const relatedTransactions = transactions.filter(t => t.accountId === id);
        relatedTransactions.forEach(t => {
            const transactionRef = doc(db, `artifacts/${appId}/users/${user.uid}/transactions`, t.id);
            batch.delete(transactionRef);
        });

        await batch.commit();
    };

    const addFundsToGoal = async (goalId, amount) => {
        if (!user) return;
        const goal = goals.find(g => g.id === goalId);
        if(goal) {
            const newCurrentAmount = (goal.currentAmount || 0) + amount;
            await updateGoal(goalId, { currentAmount: newCurrentAmount });
        }
    };

    const toggleBillPaidStatus = async (billId, isPaid) => {
        if (!user) return;

        const bill = bills.find(b => b.id === billId);
        if (!bill) {
            console.error("Bill not found");
            return;
        }

        // If marking as paid, create a transaction
        if (isPaid) {
            if (bill.transactionId) return; // Already has a transaction

            const newTransaction = {
                description: bill.name,
                amount: bill.amount,
                category: bill.category,
                date: new Date(),
                type: 'expense',
                accountId: bill.accountId || (accounts.length > 0 ? accounts[0].id : null),
            };

            const transactionId = await addTransaction(newTransaction);
            await updateBill(billId, { isPaid: true, transactionId });
        
        // If marking as unpaid, delete the transaction
        } else {
            if (bill.transactionId) {
                await deleteTransaction(bill.transactionId);
            }
            await updateBill(billId, { isPaid: false, transactionId: null });
        }
    };

    const resetBudgets = async () => {
        if (!user) return;
        const batch = writeBatch(db);
        budgets.forEach(budget => {
            const budgetRef = doc(db, `artifacts/${appId}/users/${user.uid}/budgets`, budget.id);
            batch.update(budgetRef, { currentAmount: 0 });
        });
        await batch.commit();
    };

    const value = { 
        transactions, goals, bills, budgets, savings, accounts,
        addTransaction, updateTransaction, deleteTransaction, 
        addGoal, updateGoal, deleteGoal, addFundsToGoal,
        addBill, updateBill, deleteBill, toggleBillPaidStatus,
        addBudget, updateBudget, deleteBudget, resetBudgets,
        addSavings, updateSavings, deleteSavings,
        addAccount, updateAccount, deleteAccount,
        loading 
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};