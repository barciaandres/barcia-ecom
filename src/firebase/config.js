import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyA2chlH13UAL0SnXVEhOtWHAWNk3LGO2QM",
    authDomain: "barcia-db.firebaseapp.com",
    projectId: "barcia-db",
    storageBucket: "barcia-db.firebasestorage.app",
    messagingSenderId: "361103362542",
    appId: "1:361103362542:web:60d8254fd134741b76a6ff"
};

export const app = initializeApp(firebaseConfig);