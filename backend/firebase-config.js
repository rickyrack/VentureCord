// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCS7hnupRMAN7dE6wgfb2cEBYtqDz7V5g",
  authDomain: "cord-exodus.firebaseapp.com",
  projectId: "cord-exodus",
  storageBucket: "cord-exodus.appspot.com",
  messagingSenderId: "780238825763",
  appId: "1:780238825763:web:74a06f1aaa88cf24380496"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

module.exports = { db };