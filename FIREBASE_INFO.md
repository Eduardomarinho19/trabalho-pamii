# 🔥 Informações sobre o Firebase

## Plano Gratuito (Spark Plan)

Este projeto utiliza o **plano gratuito do Firebase**, que tem as seguintes limitações:

### ✅ Serviços Disponíveis (GRATUITOS)
- **Authentication**: Login e registro de usuários
- **Firestore Database**: Banco de dados NoSQL em tempo real
- **Hosting**: Deploy de aplicações web (se necessário)

### ❌ Serviços NÃO Disponíveis no Plano Gratuito
- **Storage**: Upload e armazenamento de arquivos (imagens, vídeos, etc.)
- **Cloud Functions**: Funções serverless

## 📸 Funcionalidade de Fotos Removida

Por conta da limitação do plano gratuito, as seguintes funcionalidades foram **removidas**:

1. ❌ Upload de foto de perfil
2. ❌ Upload de imagens de produtos
3. ❌ Armazenamento de arquivos no Firebase Storage

### Arquivos Relacionados (Não utilizados)
- `services/imageService.ts` - Serviço de upload de imagens
- `services/listService.ts` - Serviço de listas colaborativas

## 🔧 Configuração do Firestore

Para o app funcionar corretamente, configure as **regras do Firestore**:

1. Acesse: https://console.firebase.google.com/
2. Selecione seu projeto
3. Vá em **Firestore Database** → **Regras**
4. Cole as regras abaixo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários autenticados podem ler/escrever seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Usuários autenticados podem gerenciar itens
    match /items/{itemId} {
      allow read, write: if request.auth != null;
    }
    
    // Usuários autenticados podem gerenciar listas
    match /lists/{listId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

5. Clique em **Publicar**

## 📊 Cotas do Plano Gratuito

- **Firestore**: 50.000 leituras/dia, 20.000 escritas/dia, 1GB de armazenamento
- **Authentication**: Usuários ilimitados
- **Sem custos**: 100% gratuito dentro das cotas

## 💡 Para Adicionar Fotos no Futuro

Se quiser adicionar funcionalidade de fotos, você precisará:

1. **Atualizar para o plano Blaze (Pay-as-you-go)**
2. **Habilitar Firebase Storage** no console
3. **Descomentar os serviços** de imagem que foram removidos
4. **Configurar regras do Storage**

---

✅ **Aplicativo 100% funcional no plano gratuito!**
