// Firebase App & Auth SDK Imports (v10+ Modular Web SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// YOUR FIREBASE CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyCTP8PbonNeeR44Sz_ZXOqzqcct-zXIUyw",
  authDomain: "affiliate-shop-e8b4d.firebaseapp.com",
  projectId: "affiliate-shop-e8b4d",
  storageBucket: "affiliate-shop-e8b4d.firebasestorage.app",
  messagingSenderId: "344146241362",
  appId: "1:344146241362:web:ac0f24bb56f5d124cc3c8b"
};

// Initialize Firebase Services
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Authentication Helper Functions
export const loginAdmin = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutAdmin = () => {
  return signOut(auth);
};

export const checkAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};
