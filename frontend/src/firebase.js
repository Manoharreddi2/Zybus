// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration - Replace with your own config from Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Analytics can fail if running on localhost or blocked by adblockers, so we wrap it
let analytics;
try {
  analytics = getAnalytics(app);
} catch (e) {
  console.warn("Firebase Analytics failed to initialize", e);
}
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, analytics };
