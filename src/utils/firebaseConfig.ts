// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpO_M5m4QU74hDdTAccg8FjGm4-XBgp50",
  authDomain: "date-dash-app.firebaseapp.com",
  projectId: "date-dash-app",
  storageBucket: "date-dash-app.firebasestorage.app",
  messagingSenderId: "625063261884",
  appId: "1:625063261884:web:5dbc73932da3a4ab5882b9",
  measurementId: "G-F0HN7MPLS3"
};

// Initialize Firebase
const FirebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(FirebaseApp);
export const db = getFirestore(FirebaseApp);