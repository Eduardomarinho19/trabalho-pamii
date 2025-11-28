import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export type Item = {
  id?: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  userId: string;
  createdAt: Timestamp | number;
};

const COLLECTION_NAME = 'items';

// Adicionar um novo item
export const addItem = async (item: Omit<Item, 'id' | 'createdAt'>, userId: string) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...item,
      userId,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar item:', error);
    throw error;
  }
};

// Buscar todos os itens do usuário
export const getItems = async (userId: string): Promise<Item[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Item));
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    throw error;
  }
};

// Atualizar um item
export const updateItem = async (id: string, updates: Partial<Item>) => {
  try {
    const itemRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(itemRef, updates);
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    throw error;
  }
};

// Deletar um item
export const deleteItem = async (id: string) => {
  try {
    const itemRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(itemRef);
  } catch (error) {
    console.error('Erro ao deletar item:', error);
    throw error;
  }
};

// Escutar mudanças em tempo real
export const subscribeToItems = (userId: string, callback: (items: Item[]) => void) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const items = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Item));
    callback(items);
  });
};