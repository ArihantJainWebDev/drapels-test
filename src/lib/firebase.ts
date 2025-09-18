import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAtQ7Z4jT-Fqguek0JtJcsvu5mqiDq_Fxs",
  authDomain: "pathforge-d2c6b.firebaseapp.com",
  projectId: "pathforge-d2c6b",
  storageBucket: "pathforge-d2c6b.appspot.com",
  messagingSenderId: "507703384302",
  appId: "1:507703384302:web:f6ad7248d2cdb368a37bff",
  measurementId: "G-QT8H2E1Y8T"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;