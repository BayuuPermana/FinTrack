import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {

  apiKey: "AIzaSyDVHj7jL9inwCYfl2PnfVkBv0mSo3v8LoY",

  authDomain: "fintrack-c13fd.firebaseapp.com",

  projectId: "fintrack-c13fd",

  storageBucket: "fintrack-c13fd.firebasestorage.app",

  messagingSenderId: "868211169132",

  appId: "1:868211169132:web:93e94ea20e07d1fd064549",

  measurementId: "G-241SMC83PC"

};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const appId = firebaseConfig.projectId;
