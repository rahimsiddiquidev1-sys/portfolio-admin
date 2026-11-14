// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// .env se config le rahe hain
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebase Initialize
const app = initializeApp(firebaseConfig);

// Auth aur Database export ( Same as before)
const auth = getAuth(app);
const db = getDatabase(app); //  Same name 'db' - kisi file mein change nahi karna

//  Extra: Storage export (optional, agar pehle se use ho raha hai)
// const storage = getStorage(app);
// export { auth, db, storage };

export { auth, db };