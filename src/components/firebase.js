// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCtA9wXh1pmR7oR1ezMFKRKbef9FNa6P3M",
    authDomain: "personal-portfolio-duy.firebaseapp.com",
    projectId: "personal-portfolio-duy",
    storageBucket: "personal-portfolio-duy.appspot.com",
    messagingSenderId: "892738788282",
    appId: "1:892738788282:web:b380b8d729db556408db83",
    measurementId: "G-4ZQZN1Y1Z5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firestore = getFirestore(app);