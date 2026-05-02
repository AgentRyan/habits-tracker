import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function initFirebase(): FirebaseApp {
  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
}

export function getDb() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getFirestore } = require("firebase/firestore");
  return getFirestore(initFirebase());
}

export function getFirebaseAuth() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getAuth } = require("firebase/auth");
  return getAuth(initFirebase());
}

// Eagerly export for client-side use only — hooks guard with useEffect so they're always browser-side
export const db = typeof window !== "undefined" ? (() => {
  const { getFirestore } = require("firebase/firestore");
  return getFirestore(initFirebase());
})() : null as never;

export const auth = typeof window !== "undefined" ? (() => {
  const { getAuth } = require("firebase/auth");
  return getAuth(initFirebase());
})() : null as never;
