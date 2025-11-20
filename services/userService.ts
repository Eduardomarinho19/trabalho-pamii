import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export type UserProfile = {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: number;
  updatedAt: number;
};

const USERS_COLLECTION = 'users';

// Criar ou atualizar perfil do usuário
export const saveUserProfile = async (uid: string, profileData: Partial<UserProfile>): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Criar novo perfil
      await setDoc(userRef, {
        ...profileData,
        uid,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } else {
      // Atualizar perfil existente
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: Date.now(),
      });
    }
  } catch (error) {
    console.error('Erro ao salvar perfil:', error);
    throw error;
  }
};

// Buscar perfil do usuário
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    throw error;
  }
};
