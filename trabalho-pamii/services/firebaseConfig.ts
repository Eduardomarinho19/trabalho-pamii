import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configurações do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB55lSV0vbm_X1PSiA41o12g87Ko-RY6TE",
    authDomain: "lista-de-compras-50a2d.firebaseapp.com",
    projectId: "lista-de-compras-50a2d",
    storageBucket: "lista-de-compras-50a2d.firebasestorage.app",
    messagingSenderId: "983841050637",
    appId: "1:983841050637:web:15a4fd41ce0fc1fe2e8544",
    measurementId: "G-J03M5MDH0F"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore
export const db = getFirestore(app);

export default app;