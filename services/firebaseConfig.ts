import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { enableIndexedDbPersistence, getFirestore } from 'firebase/firestore';

// Configurações do Firebase - usando variáveis de ambiente
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore
export const db = getFirestore(app);

// Habilitar persistência offline (apenas para web)
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Múltiplas abas abertas, persistência desabilitada
    } else if (err.code === 'unimplemented') {
      // Navegador não suporta persistência
    }
  });
}

// Inicializa o Auth
export const auth = getAuth(app);

export default app;