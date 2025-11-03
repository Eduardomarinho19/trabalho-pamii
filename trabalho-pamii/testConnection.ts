// Teste simples para verificar a conexão com Firebase
import { db } from './services/firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  console.log('=== TESTE DE CONEXÃO FIREBASE ===');
  
  try {
    // Teste 1: Verificar se a instância do db está funcionando
    console.log('1. Testando instância do database...');
    console.log('Database instance:', db);
    console.log('Database app:', db.app);
    console.log('Database type:', db.type);
    
    // Teste 2: Tentar criar referência da coleção
    console.log('2. Testando referência da coleção...');
    const collectionRef = collection(db, 'items');
    console.log('Collection reference criada:', collectionRef);
    
    // Teste 3: Tentar ler a coleção
    console.log('3. Tentando ler coleção items...');
    const querySnapshot = await getDocs(collectionRef);
    console.log('✅ Leitura bem-sucedida. Documentos encontrados:', querySnapshot.size);
    
    querySnapshot.forEach((doc) => {
      console.log('Documento encontrado:', doc.id, '=>', doc.data());
    });
    
    // Teste 4: Tentar adicionar um documento muito simples
    console.log('4. Tentando adicionar documento de teste...');
    const testDoc = {
      name: 'Teste Simples',
      price: 1.99,
      createdAt: new Date().toISOString()
    };
    
    console.log('Dados do teste:', testDoc);
    const docRef = await addDoc(collectionRef, testDoc);
    console.log('✅ Documento adicionado com ID:', docRef.id);
    
    return { success: true, message: `Firebase OK! Doc ID: ${docRef.id}` };
    
  } catch (error) {
    console.error('❌ ERRO DETALHADO:', error);
    
    if (error instanceof Error) {
      console.error('Nome do erro:', error.name);
      console.error('Mensagem:', error.message);
      console.error('Stack:', error.stack);
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
};