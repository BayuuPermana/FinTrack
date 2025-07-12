/*
* =================================================================
* FILE: src/contexts/DataContext.js
* =================================================================
* Description: Manages all application data (transactions, goals, bills)
* and provides CRUD functions.
*/
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(true);
            const collections = {
                transactions: collection(db, `artifacts/${appId}/users/${user.uid}/transactions`),
                goals: collection(db, `artifacts/${appId}/users/${user.uid}/goals`),
                bills: collection(db, `artifacts/${appId}/users/${user.uid}/bills`),
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
            setLoading(false);
        }
    }, [user]);

    const createItem = (collectionName) => async (item) => {
        if (!user) return;
        await addDoc(collection(db, `artifacts/${appId}/users/${user.uid}/${collectionName}`), item);
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

    const addFundsToGoal = async (goalId, amount) => {
        if (!user) return;
        const goal = goals.find(g => g.id === goalId);
        if(goal) {
            const newCurrentAmount = (goal.currentAmount || 0) + amount;
            await updateGoal(goalId, { currentAmount: newCurrentAmount });
        }
    };

    const toggleBillPaidStatus = async (billId, isPaid) => {
        if(!user) return;
        await updateBill(billId, { isPaid });
    };

    const value = { 
        transactions, goals, bills, 
        addTransaction, updateTransaction, deleteTransaction, 
        addGoal, updateGoal, deleteGoal, addFundsToGoal,
        addBill, updateBill, deleteBill, toggleBillPaidStatus,
        loading 
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};