import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "spiritual-library-zcf5x",
  appId: "1:695035627897:web:8050f7147abdd811cc47a8",
  apiKey: "AIzaSyA8VBNisnCe-9oN_b-_4CpGHtZVEt34gzM",
  authDomain: "spiritual-library-zcf5x.firebaseapp.com",
  // Specify custom Database ID if highlighted
  // Wait, firestoreDatabaseId is optional but let's initialize firestore properly.
  // In firebase JS SDK, you retrieve DB using getFirestore(app, databaseId)
  // Let's specify it so the target is exact.
  storageBucket: "spiritual-library-zcf5x.firebasestorage.app",
  messagingSenderId: "695035627897"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
export const db = getFirestore(app, "ai-studio-be24b114-f228-447c-8c2e-efafe6212dab");
