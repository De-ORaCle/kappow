import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

// Check if the config is actually populated
const isConfigValid = firebaseConfig && firebaseConfig.apiKey;

const app = !getApps().length && isConfigValid ? initializeApp(firebaseConfig) : (getApps()[0] || null);

export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;

export const isFirebaseReady = !!db;
