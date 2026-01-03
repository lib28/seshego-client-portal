// Firebase core
import { initializeApp } from "firebase/app";

// Firebase services
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔐 Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcYQrqlMkDK1V85POJFiFUTHVGQBsFYJM",
  authDomain: "client-portal-891b2.firebaseapp.com",
  projectId: "client-portal-891b2",
  storageBucket: "client-portal-891b2.firebasestorage.app",
  messagingSenderId: "364965250236",
  appId: "1:364965250236:web:fb59c63f05277529e3bcb9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(
  app,
  "gs://client-portal-891b2.firebasestorage.app"
);
