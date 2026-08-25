import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAE44DxNnqz3m8ScqaZxoSj2FdQ7aJ2NIg",
  authDomain: "estate-pro-d564b.firebaseapp.com",
  projectId: "estate-pro-d564b",
  storageBucket: "estate-pro-d564b.firebasestorage.app",
  messagingSenderId: "600309829118",
  appId: "1:600309829118:web:60c61624ca8cdf05e884af",
  measurementId: "G-TG60FCJHXB"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { app, db };