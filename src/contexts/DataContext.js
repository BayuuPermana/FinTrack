import React, { useState, useEffect, createContext, useContext } from 'react';
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query } from 'firebase/firestore';
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
        if (user) {
            setLoading(true);
            const collections = {
                transactions: collection(db, `artifacts/${appId}/users/${user.uid}/transactions`),
                goals: collection(db, `artifacts/${appId}/users/${user.uid}/goals`),
                bills: collection(db, `artifacts/${appId}/users/${user.uid}/bills`),
                budgets: collection(db, `artifacts/${appId}/users/${user.uid}/budgets`),
                savings: collection(db, `artifacts/${appId}/users/${user.uid}/savings`),
                accounts: collection(db, `artifacts/${appId}/users/${user.uid}/accounts`),
            };

            const unsubscribes = Object.entries(collections).map(([name, coll]) => {
                const q = query(coll);
                return onSnapshot(q, (snapshot) => {
                    const data = snapshot.docs.map(doc => {
                        const docData = doc.data();
                        const convertedData = Object.keys(docData).reduce((acc, key) => {
                            if (docData[key]?.toDate) {
                                acc[key] = docData[key].toDate();
                            } else {
                                acc[key] = docData[key];
                            }
                            return acc;
                        }, {});
                        return { id: doc.id, ...convertedData };
                    });

                    switch (name) {
                        case 'transactions': setTransactions(data); break;
                        case 'goals': setGoals(data); break;
                        case 'bills': setBills(data); break;
                        case 'budgets': setBudgets(data); break;
                        case 'savings': setSavings(data); break;
                        case 'accounts': setAccounts(data); break;
                        default: break;
                    }
                }, error => console.error(`Error fetching ${name}:`, error));
            });
            
            setLoading(false);
            return () => unsubscribes.forEach(unsub => unsub());
        } else {
            setTransactions([]);
            setGoals([]);
            setBills([]);
            setBudgets([]);
            setSavings([]);
            setAccounts([]);
            setLoading(false);
        }
    }, [user]);

    const createItem = (collectionName) => async (item) => {
        if (!user) return;
        const docRef = await addDoc(collection(db, `artifacts/${appId}/users/${user.uid}/${collectionName}`), item);
        return docRef.id;
    };

    const updateItem = (collectionName) => async (id, updatedItem) => {
        if (!user) return;
        await updateDoc(doc(db, `artifacts/${appId}/users/${user.uid}/${collectionName}`, id), updatedItem);
    };

    const deleteItem = (collectionName) => async (id) => {
        if (!user) return;
        await deleteDoc(doc(db, `artifacts/${appId}/users/${user.uid}/${collectionName}`, id));
    };

    const addTransaction = createItem('transactions');
    const updateTransaction = updateItem('transactions');
    const deleteTransaction = deleteItem('transactions');
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
    const deleteAccount = deleteItem('accounts');

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

    const value = { 
        transactions, goals, bills, budgets, savings, accounts,
        addTransaction, updateTransaction, deleteTransaction, 
        addGoal, updateGoal, deleteGoal, addFundsToGoal,
        addBill, updateBill, deleteBill, toggleBillPaidStatus,
        addBudget, updateBudget, deleteBudget,
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
