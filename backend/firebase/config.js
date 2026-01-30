import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error('Falta la variable de entorno FIREBASE_SERVICE_ACCOUNT');
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

const app = initializeApp({
  credential: cert(serviceAccount)
});

export const db = getFirestore(app);

// import { getAuth } from 'firebase-admin/auth';
// export const auth = getAuth(app);