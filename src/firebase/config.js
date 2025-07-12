/*
* =================================================================
* FILE: src/firebase/config.js
* =================================================================
* Description: Initializes and exports Firebase services.
* This centralizes the Firebase configuration.
*/
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// This configuration is provided by the environment.
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
export const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-budget-app';

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);