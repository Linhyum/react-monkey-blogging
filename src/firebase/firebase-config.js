// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyCAjSHHw8BNGaEOOqZkIqV81lpRaT2hIbw",
    authDomain: "monkey-blogging-a1270.firebaseapp.com",
    projectId: "monkey-blogging-a1270",
    storageBucket: "monkey-blogging-a1270.appspot.com",
    messagingSenderId: "393836259162",
    appId: "1:393836259162:web:dde51a9a2eb192ff19f563",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
