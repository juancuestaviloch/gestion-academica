import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { config } from '../config/index.js';

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './service-account.json';

let firestore: admin.firestore.Firestore | null = null;

if (existsSync(serviceAccountPath)) {
  try {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    firestore = admin.firestore();
    console.log('Firebase Firestore initialized successfully.');
  } catch (error) {
    console.warn('Failed to initialize Firebase:', error);
  }
} else {
  console.warn('Firebase service-account.json not found. Cloud sync disabled.');
}

export async function syncMessageToCloud(userId: number, role: string, content: string) {
  if (!firestore) return;

  try {
    const docRef = firestore.collection('users').doc(userId.toString()).collection('messages').doc();
    await docRef.set({
      role,
      content,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error('Error syncing to Firebase:', error);
  }
}

export default firestore;
