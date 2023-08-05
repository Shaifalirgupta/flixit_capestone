// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
const firebaseConfig = {
  apiKey: "AIzaSyBB-BYngT0ZlCgybJFPEfhc3IRPQMeHZmw",
  authDomain: "flix-xit.firebaseapp.com",
  projectId: "flix-xit",
  storageBucket: "flix-xit.appspot.com",
  messagingSenderId: "715342406197",
  appId: "1:715342406197:web:8b4c59d83a4aa68475c77c",
  measurementId: "G-P00326KSM1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app)