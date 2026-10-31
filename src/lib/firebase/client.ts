"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

// Configuration pasted from a console occasionally contains surrounding quotes.
// Next.js does not remove them, so normalize here before Firebase consumes it.
function envValue(value: string | undefined, fallback: string) {
  return (value || fallback).trim().replace(/^["']+|["']+$/g, "");
}

const config = {
  // Placeholder values let static build rendering complete; real auth calls still
  // fail visibly until .env.local is configured.
  apiKey: envValue(process.env.NEXT_PUBLIC_FIREBASE_API_KEY, "AIzaSyDUMMY_CONFIGURATION_REQUIRED_0000000"),
  authDomain: envValue(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, "localhost"),
  projectId: envValue(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, "demo-ielts-prep"),
  storageBucket: envValue(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, "demo-ielts-prep.appspot.com"),
  messagingSenderId: envValue(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, "000000000000"),
  appId: envValue(process.env.NEXT_PUBLIC_FIREBASE_APP_ID, "1:000000000000:web:0000000000000000000000"),
};
const app = getApps().length ? getApp() : initializeApp(config);
export const auth = getAuth(app);
export const db = getFirestore(app);

if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true" && typeof window !== "undefined") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}
