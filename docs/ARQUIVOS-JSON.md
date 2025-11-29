# 📄 Documentação dos Arquivos JSON

## 📋 Visão Geral

Este documento descreve todos os arquivos JSON de configuração do aplicativo Lista de Compras, explicando sua função e estrutura.

---

## 📦 package.json

**Localização:** `/package.json`

**Descrição:** Arquivo principal de configuração do Node.js que gerencia dependências, scripts e metadados do projeto.

### **Informações do Projeto**
```json
{
  "name": "trabalho-pamii",
  "version": "1.0.0",
  "main": "expo-router/entry"
}
```
- **name**: Nome do projeto
- **version**: Versão atual do aplicativo
- **main**: Ponto de entrada usando Expo Router

### **Scripts Disponíveis**
```bash
npm start           # Inicia o servidor de desenvolvimento Expo
npm run android     # Inicia no emulador/dispositivo Android
npm run ios         # Inicia no simulador/dispositivo iOS
npm run web         # Inicia versão web
npm run lint        # Executa verificação de código com ESLint
```

### **Dependências Principais**

#### **Expo & React**
- `expo`: ~54.0.20 - Framework principal
- `react`: 19.1.0 - Biblioteca React
- `react-native`: 0.81.5 - Framework mobile
- `expo-router`: ~6.0.13 - Navegação baseada em arquivos

#### **Firebase**
- `firebase`: ^12.5.0 - Backend (Auth + Firestore)

#### **Navegação**
- `@react-navigation/native`: ^7.1.8 - Navegação principal
- `@react-navigation/bottom-tabs`: ^7.4.0 - Navegação com tabs
- `react-native-screens`: ~4.16.0 - Otimização de telas
- `react-native-gesture-handler`: ~2.28.0 - Gestos nativos

#### **UI/UX**
- `@expo/vector-icons`: ^15.0.3 - Ícones
- `expo-image`: ~3.0.10 - Otimização de imagens
- `expo-haptics`: ~15.0.7 - Feedback tátil
- `react-native-reanimated`: ~4.1.1 - Animações

#### **Armazenamento & Estado**
- `@react-native-async-storage/async-storage`: ^1.24.0 - Armazenamento local

#### **Utilitários**
- `expo-constants`: ~18.0.10 - Constantes do app
- `expo-linking`: ~8.0.8 - Deep linking
- `expo-status-bar`: ~3.0.8 - Barra de status
- `expo-system-ui`: ~6.0.8 - UI do sistema
- `dotenv`: ^17.2.3 - Variáveis de ambiente

### **Dependências de Desenvolvimento**
```json
{
  "@types/react": "~19.1.0",
  "eslint": "^9.25.0",
  "eslint-config-expo": "~10.0.0",
  "typescript": "~5.9.2"
}
```
- **TypeScript**: Tipagem estática
- **ESLint**: Linting de código

---

## 🚀 app.json

**Localização:** `/app.json`

**Descrição:** Configuração principal do Expo, definindo metadados, ícones, splash screen e comportamentos do app.

### **Metadados Básicos**
```json
{
  "name": "trabalho-pamii",
  "slug": "trabalho-pamii",
  "version": "1.0.0",
  "orientation": "portrait"
}
```
- **name**: Nome exibido do aplicativo
- **slug**: Identificador único no Expo
- **version**: Versão do app
- **orientation**: Orientação da tela (portrait = vertical)

### **Configurações de UI**
```json
{
  "icon": "./assets/images/icon.png",
  "scheme": "trabalhopamii",
  "userInterfaceStyle": "automatic",
  "newArchEnabled": true
}
```
- **icon**: Ícone do aplicativo
- **scheme**: Deep linking scheme (trabalhopamii://)
- **userInterfaceStyle**: Suporte automático a tema claro/escuro
- **newArchEnabled**: Nova arquitetura React Native habilitada

### **Configurações iOS**
```json
{
  "ios": {
    "supportsTablet": true
  }
}
```
- **supportsTablet**: Suporte para iPad

### **Configurações Android**
```json
{
  "android": {
    "adaptiveIcon": {
      "backgroundColor": "#E6F4FE",
      "foregroundImage": "./assets/images/android-icon-foreground.png",
      "backgroundImage": "./assets/images/android-icon-background.png",
      "monochromeImage": "./assets/images/android-icon-monochrome.png"
    },
    "edgeToEdgeEnabled": true,
    "predictiveBackGestureEnabled": false
  }
}
```
- **adaptiveIcon**: Ícone adaptável para diferentes launchers
- **edgeToEdgeEnabled**: Tela cheia (edge-to-edge)
- **predictiveBackGestureEnabled**: Desabilita gesto de voltar preditivo

### **Configurações Web**
```json
{
  "web": {
    "output": "static",
    "favicon": "./assets/images/favicon.png"
  }
}
```
- **output**: Build estático para web
- **favicon**: Ícone do navegador

### **Plugins Expo**
```json
{
  "plugins": [
    "expo-router",
    [
      "expo-splash-screen",
      {
        "image": "./assets/images/splash-icon.png",
        "imageWidth": 200,
        "resizeMode": "contain",
        "backgroundColor": "#ffffff",
        "dark": {
          "backgroundColor": "#000000"
        }
      }
    ]
  ]
}
```
- **expo-router**: Navegação baseada em arquivos
- **expo-splash-screen**: Tela de inicialização com suporte a tema escuro

### **Recursos Experimentais**
```json
{
  "experiments": {
    "typedRoutes": true,
    "reactCompiler": true
  }
}
```
- **typedRoutes**: Rotas tipadas com TypeScript
- **reactCompiler**: Novo compilador React (otimização)

---

## 🔧 tsconfig.json

**Localização:** `/tsconfig.json`

**Descrição:** Configuração do TypeScript para o projeto.

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
```

### **Configurações**
- **extends**: Herda configurações base do Expo
- **strict**: Modo estrito do TypeScript (máxima segurança de tipos)
- **paths**: Alias `@/` para importações absolutas
- **include**: Arquivos TypeScript a serem compilados

---

## 🔥 firebase.json

**Localização:** `/firebase.json`

**Descrição:** Configuração do Firebase para o projeto.

```json
{
  "firestore": {
    "rules": "database/firestore.rules",
    "indexes": "database/firestore.indexes.json"
  }
}
```

### **Configurações Firestore**
- **rules**: Localização das regras de segurança do Firestore
- **indexes**: Localização dos índices compostos do Firestore

---

## 🗂️ firestore.indexes.json

**Localização:** `/database/firestore.indexes.json`

**Descrição:** Define índices compostos para otimizar consultas no Firestore.

```json
{
  "indexes": [
    {
      "collectionGroup": "items",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "items",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

### **Índice 1: userId + createdAt**
- **Finalidade**: Buscar itens de um usuário ordenados por data
- **Consulta otimizada**: 
  ```typescript
  where('userId', '==', uid)
  .orderBy('createdAt', 'desc')
  ```

### **Índice 2: userId + category + createdAt**
- **Finalidade**: Buscar itens de um usuário por categoria, ordenados por data
- **Consulta otimizada**:
  ```typescript
  where('userId', '==', uid)
  .where('category', '==', 'Alimentos')
  .orderBy('createdAt', 'desc')
  ```

### **Por que usar índices?**
- ✅ Melhor performance em consultas complexas
- ✅ Suporte a múltiplos filtros e ordenações
- ✅ Reduz tempo de resposta do banco de dados

---

## 🌐 cors.json

**Localização:** `/cors.json`

**Descrição:** Configuração de CORS (Cross-Origin Resource Sharing) para o Firebase Storage.

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

### **Configurações**
- **origin**: `["*"]` - Permite requisições de qualquer origem
- **method**: Métodos HTTP permitidos
  - GET: Ler arquivos
  - POST: Upload de arquivos
  - PUT: Atualizar arquivos
  - DELETE: Deletar arquivos
- **maxAgeSeconds**: Cache de 1 hora (3600 segundos)

### **⚠️ Atenção**
- `"origin": ["*"]` permite acesso de qualquer domínio
- Em produção, considere restringir para domínios específicos:
  ```json
  "origin": ["https://seuapp.com", "https://www.seuapp.com"]
  ```

---

## 🧹 eslint.config.js

**Localização:** `/eslint.config.js`

**Descrição:** Configuração do ESLint para análise estática de código.

```javascript
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
]);
```

### **Configurações**
- **expoConfig**: Usa regras recomendadas do Expo
- **ignores**: Ignora pasta `dist/` (build files)

### **Funcionalidades**
- ✅ Detecta erros de sintaxe
- ✅ Força padrões de código consistentes
- ✅ Identifica problemas de performance
- ✅ Sugere melhorias de código

---

## 📊 Resumo dos Arquivos JSON

| Arquivo | Finalidade | Categoria |
|---------|-----------|-----------|
| `package.json` | Dependências e scripts | Configuração Node.js |
| `app.json` | Configuração Expo | Configuração App |
| `tsconfig.json` | Configuração TypeScript | Compilação |
| `firebase.json` | Configuração Firebase | Backend |
| `firestore.indexes.json` | Índices do Firestore | Banco de Dados |
| `cors.json` | CORS do Storage | Segurança |
| `eslint.config.js` | Linting de código | Qualidade |

---

## 🔑 Principais Tecnologias Configuradas

### **Frontend**
- React Native 0.81.5
- React 19.1.0
- TypeScript 5.9.2
- Expo 54.0.20

### **Backend**
- Firebase 12.5.0
  - Authentication
  - Firestore Database
  - Storage

### **Navegação**
- Expo Router 6.0.13
- React Navigation 7.1.8

### **Desenvolvimento**
- ESLint 9.25.0
- TypeScript (strict mode)

---

## 🛠️ Comandos Úteis

### **Desenvolvimento**
```bash
npm start              # Inicia servidor dev
npm run web            # Versão web
npm run android        # Android
npm run ios            # iOS
```

### **Qualidade de Código**
```bash
npm run lint           # Verificar código
npm run lint -- --fix  # Corrigir automaticamente
```

### **Firebase**
```bash
firebase deploy --only firestore:rules   # Deploy de regras
firebase deploy --only firestore:indexes # Deploy de índices
```

---

## 📝 Notas Importantes

### **Segurança**
- ✅ Firebase configurado com regras de segurança
- ✅ TypeScript em modo strict
- ✅ Índices otimizados para performance
- ⚠️ CORS configurado para aceitar qualquer origem (considere restringir)

### **Performance**
- ✅ Nova arquitetura React Native habilitada
- ✅ React Compiler experimental ativo
- ✅ Índices compostos do Firestore
- ✅ Reanimated para animações nativas

### **Compatibilidade**
- ✅ iOS (incluindo iPad)
- ✅ Android
- ✅ Web (build estático)
- ✅ Tema claro/escuro automático

---

**Última atualização:** Novembro 2025
