// Script de teste para verificar a conexão com o Firebase
// Execute este arquivo para testar se o Firebase está configurado corretamente

import { addItem, getItems } from './services/firebaseService';

async function testFirebase() {
  try {
    console.log('🔥 Testando conexão com Firebase...');
    
    // Tenta buscar itens
    const items = await getItems();
    console.log('✅ Conexão estabelecida! Itens encontrados:', items.length);
    
    // Tenta adicionar um item de teste
    const testItem = {
      name: 'Item de Teste',
      price: 9.99,
      description: 'Este é um item de teste',
      category: 'Teste',
      createdAt: Date.now()
    };
    
    const itemId = await addItem(testItem);
    console.log('✅ Item de teste adicionado com ID:', itemId);
    
    console.log('🎉 Firebase configurado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro na configuração do Firebase:', error);
    console.log('📝 Verifique se:');
    console.log('   1. As credenciais no firebaseConfig.ts estão corretas');
    console.log('   2. O Firestore Database foi criado no console do Firebase');
    console.log('   3. As regras de segurança permitem leitura/escrita');
  }
}

testFirebase();