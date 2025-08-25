import React, { useState, useEffect, createContext, useContext } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Store user in local storage to persist session
                localStorage.setItem('authUser', JSON.stringify(currentUser));
            } else {
                // Clear user from local storage on sign out
                localStorage.removeItem('authUser');
                setUser(null);
            }
            setLoading(false);
        });

        // Check for persisted user in local storage
        const persistedUser = localStorage.getItem('authUser');
        if (persistedUser) {
            setUser(JSON.parse(persistedUser));
            setLoading(false);
        } else {
            // If no persisted user, sign in anonymously
            signInAnonymously(auth).catch(error => {
                console.error("Anonymous sign-in error:", error);
                setLoading(false);
            });
        }

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
