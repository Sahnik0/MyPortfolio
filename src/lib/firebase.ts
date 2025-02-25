
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAlIIWJhAWDGu26kG-b8RHmPmHqw4YViMM",
  authDomain: "portfolio-28e6c.firebaseapp.com",
  projectId: "portfolio-28e6c",
  storageBucket: "portfolio-28e6c.firebasestorage.app",
  messagingSenderId: "1049444180014",
  appId: "1:1049444180014:web:dbe16f2a16a93ca2987fbf",
  measurementId: "G-N6ZWYRLMYH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);