import React, { useState, useEffect, createContext, useContext } from 'react';
import { signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const attemptSignIn = async () => {
            try {
                if (typeof window.__initial_auth_token !== 'undefined' && window.__initial_auth_token) {
                    await signInWithCustomToken(auth, window.__initial_auth_token);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (error) {
                console.error("Authentication Error:", error);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        attemptSignIn();
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
