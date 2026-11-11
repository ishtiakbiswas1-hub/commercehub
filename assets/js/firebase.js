import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp, 
  query, 
  orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCTP8PbonNeeR44Sz_ZXOqzqcct-zXIUyw",
  authDomain: "affiliate-shop-e8b4d.firebaseapp.com",
  projectId: "affiliate-shop-e8b4d",
  storageBucket: "affiliate-shop-e8b4d.firebasestorage.app",
  messagingSenderId: "344146241362",
  appId: "1:344146241362:web:ac0f24bb56f5d124cc3c8b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth Helpers
export const loginAdmin = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const logoutAdmin = () => signOut(auth);
export const checkAuthState = (callback) => onAuthStateChanged(auth, callback);

// Firestore Product Helpers
export const productsCollection = collection(db, "products");

export const addProductToDB = async (productData) => {
  return await addDoc(productsCollection, {
    ...productData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const updateProductInDB = async (id, updatedData) => {
  const productRef = doc(db, "products", id);
  return await updateDoc(productRef, {
    ...updatedData,
    updatedAt: serverTimestamp()
  });
};

export const deleteProductFromDB = async (id) => {
  const productRef = doc(db, "products", id);
  return await deleteDoc(productRef);
};

export const listenToProducts = (callback) => {
  const q = query(productsCollection, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(products);
  });
};

// Storage Image Upload Helper
export const uploadProductImage = async (file) => {
  const fileName = `products/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, fileName);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};
