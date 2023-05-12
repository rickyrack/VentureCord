// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2il95YdNIVE-y4gZmdjXTQIFXDoZGFBE",
  authDomain: "venture-fb6d8.firebaseapp.com",
  projectId: "venture-fb6d8",
  storageBucket: "venture-fb6d8.appspot.com",
  messagingSenderId: "539490509501",
  appId: "1:539490509501:web:704621c34f8eee8d418dd4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

module.exports = { db };