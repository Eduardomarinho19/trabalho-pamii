# 📱 Documentação do Aplicativo - Lista de Compras

## 📋 Visão Geral

Aplicativo de lista de compras desenvolvido com **React Native**, **Expo Router** e **Firebase**, permitindo que usuários gerenciem suas listas de forma segura e em tempo real.

---

## 🏗️ Arquitetura do Projeto

### **Estrutura de Pastas**

```
trabalho-pamii/
├── app/                    # Telas do aplicativo (Expo Router)
├── components/             # Componentes reutilizáveis
├── contexts/              # Context API (Auth e Theme)
├── database/              # Configuração e serviços do Firebase
├── services/              # Serviços de autenticação e usuário
├── utils/                 # Utilitários (Alert, etc)
└── constants/             # Constantes e temas
```

---

## 🖥️ Principais Telas

### 1. **Tela de Login** (`app/login.tsx`)

**Funcionalidades:**
- ✅ Login com e-mail e senha
- ✅ Validação de e-mail e senha
- ✅ Toggle para mostrar/ocultar senha
- ✅ Navegação para cadastro
- ✅ Link para recuperação de senha
- ✅ Redirecionamento automático se já autenticado

**Principais Funções:**

```typescript
handleLogin()
- Valida campos (e-mail e senha)
- Verifica formato de e-mail
- Chama loginUser() do authService
- Redireciona para tela principal após sucesso

isValidEmail()
- Valida formato do e-mail usando regex
```

---

### 2. **Tela de Cadastro** (`app/register.tsx`)

**Funcionalidades:**
- ✅ Cadastro de novos usuários
- ✅ Validação de e-mail
- ✅ Confirmação de senha
- ✅ Toggle para mostrar/ocultar senha
- ✅ Redirecionamento automático se já autenticado

**Principais Funções:**

```typescript
handleRegister()
- Valida todos os campos
- Verifica se senhas coincidem
- Exige senha com mínimo 6 caracteres
- Chama registerUser() do authService
- Redireciona para login após sucesso
```

---

### 3. **Tela de Recuperação de Senha** (`app/reset-password.tsx`)

**Funcionalidades:**
- ✅ Envio de e-mail para recuperação de senha
- ✅ Validação de formato de e-mail
- ✅ Feedback visual de sucesso

**Principais Funções:**

```typescript
handleResetPassword()
- Valida e-mail
- Envia e-mail de recuperação via Firebase Auth
- Exibe mensagem de confirmação
```

---

### 4. **Tela Principal - Home** (`app/index.tsx`)

**Funcionalidades:**
- ✅ Lista de itens em tempo real (Firebase Realtime)
- ✅ Busca/filtro de itens
- ✅ Adicionar novos itens
- ✅ Editar itens existentes
- ✅ Deletar itens com confirmação
- ✅ Cálculo automático do total
- ✅ Toggle de tema claro/escuro
- ✅ Navegação para perfil
- ✅ Logout com confirmação

**Principais Funções:**

```typescript
subscribeToItems()
- Escuta mudanças no Firestore em tempo real
- Atualiza lista automaticamente quando há alterações

filteredItems (useMemo)
- Filtra itens baseado no texto de busca
- Busca por nome ou descrição

totalValue (useMemo)
- Calcula valor total dos itens filtrados
- Otimizado para não recalcular desnecessariamente

saveItem()
- Adiciona novo item ou atualiza existente
- Valida dados antes de salvar
- Chama addItem() ou updateItem() do firebaseService

handleDeleteItem()
- Exibe confirmação antes de deletar
- Remove item do Firestore

handleLogout()
- Confirma logout com usuário
- Desloga e redireciona para login
```

---

### 5. **Tela de Perfil** (`app/profile.tsx`)

**Funcionalidades:**
- ✅ Visualização de dados do usuário
- ✅ Edição de nome de exibição
- ✅ E-mail (não editável)
- ✅ Avatar com ícone

**Principais Funções:**

```typescript
loadProfile()
- Busca perfil do usuário no Firestore
- Cria perfil inicial se não existir

handleSaveProfile()
- Salva alterações no perfil
- Atualiza dados no Firestore
```

---

## 🔐 Serviços de Autenticação

### **AuthService** (`services/authService.ts`)

Gerencia toda a autenticação usando Firebase Auth.

**Funções Principais:**

```typescript
registerUser(email, password)
- Cria nova conta no Firebase Auth
- Retorna objeto User

loginUser(email, password)
- Autentica usuário existente
- Retorna objeto User

logoutUser()
- Desloga usuário atual

observeAuthState(callback)
- Observa mudanças no estado de autenticação
- Retorna função de unsubscribe

resetPassword(email)
- Envia e-mail de recuperação de senha

getAuthErrorMessage(errorCode)
- Traduz códigos de erro do Firebase para português
```

---

## 📊 Serviços do Firebase

### **FirebaseService** (`database/services/firebaseService.ts`)

Gerencia operações CRUD no Firestore.

**Funções Principais:**

```typescript
addItem(item, userId)
- Adiciona novo item à coleção 'items'
- Associa item ao userId
- Retorna ID do documento criado

getItems(userId)
- Busca todos os itens do usuário
- Ordena por data de criação (descendente)
- Retorna array de Items

updateItem(id, updates)
- Atualiza campos específicos de um item
- Usa merge para atualização parcial

deleteItem(id)
- Remove item do Firestore

subscribeToItems(userId, callback)
- Escuta mudanças em tempo real
- Retorna função de unsubscribe
- Atualiza UI automaticamente
```

**Tipo de Dados:**

```typescript
type Item = {
  id?: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  userId: string;
  createdAt: Timestamp | number;
}
```

---

## 🎨 Contexts (Context API)

### **AuthContext** (`contexts/AuthContext.tsx`)

Gerencia estado global de autenticação.

**Funcionalidades:**
- Observa mudanças no estado de autenticação
- Fornece informações do usuário para toda a aplicação
- Gerencia estado de loading

**Dados Fornecidos:**
```typescript
{
  user: User | null;          // Usuário atual
  loading: boolean;           // Estado de carregamento
  isAuthenticated: boolean;   // Se está autenticado
}
```

**Hook:**
```typescript
const { user, loading, isAuthenticated } = useAuth();
```

---

### **ThemeContext** (`contexts/ThemeContext.tsx`)

Gerencia tema claro/escuro da aplicação.

**Funcionalidades:**
- Toggle entre modo claro e escuro
- Persiste preferência do usuário
- Fornece cores e estilos consistentes

**Dados Fornecidos:**
```typescript
{
  theme: Theme;              // Objeto com cores do tema
  isDarkMode: boolean;       // Se está em modo escuro
  toggleTheme: () => void;   // Função para alternar tema
}
```

**Hook:**
```typescript
const { theme, isDarkMode, toggleTheme } = useTheme();
```

---

## 🧩 Componentes Reutilizáveis

### **ItemCard** (`components/ItemCard.tsx`)

Exibe um item da lista com opções de editar e deletar.

**Props:**
- `item`: Item a ser exibido
- `onEdit`: Callback para edição
- `onDelete`: Callback para exclusão
- `theme`: Objeto de tema para estilização

---

### **ItemForm** (`components/ItemForm.tsx`)

Formulário para adicionar/editar itens.

**Props:**
- `initial?`: Item inicial (para edição)
- `onSubmit`: Callback ao salvar
- `onCancel`: Callback ao cancelar
- `loading`: Estado de carregamento

**Campos:**
- Nome (obrigatório)
- Preço (obrigatório)
- Descrição (opcional)
- Categoria (opcional)

---

## 🔄 Fluxo de Dados

### **Fluxo de Autenticação:**

```
1. Usuário acessa app
   ↓
2. AuthContext verifica estado (observeAuthState)
   ↓
3. Se não autenticado → Redireciona para /login
   ↓
4. Usuário faz login/cadastro
   ↓
5. Firebase Auth valida credenciais
   ↓
6. AuthContext atualiza estado
   ↓
7. Redireciona para tela principal
```

### **Fluxo de Gerenciamento de Itens:**

```
1. Tela principal carrega
   ↓
2. subscribeToItems() inicia escuta do Firestore
   ↓
3. Itens são exibidos em tempo real
   ↓
4. Usuário adiciona/edita/deleta item
   ↓
5. Firestore é atualizado
   ↓
6. Subscription detecta mudança
   ↓
7. UI atualiza automaticamente
```

---

## 🛡️ Segurança

### **Regras do Firestore** (`database/firestore.rules`)

- ✅ Usuários só podem ler/escrever seus próprios dados
- ✅ Validação de tipos e campos obrigatórios
- ✅ Proteção contra acessos não autorizados

### **Validações no App:**

- ✅ Validação de formato de e-mail
- ✅ Senha mínima de 6 caracteres
- ✅ Confirmação de senha no cadastro
- ✅ Validação de campos obrigatórios
- ✅ Sanitização de inputs

---

## 🎯 Funcionalidades Principais

### **Autenticação:**
- [x] Login com e-mail e senha
- [x] Cadastro de novos usuários
- [x] Recuperação de senha
- [x] Logout
- [x] Persistência de sessão
- [x] Proteção de rotas

### **Lista de Compras:**
- [x] Adicionar itens
- [x] Editar itens
- [x] Deletar itens (com confirmação)
- [x] Buscar/filtrar itens
- [x] Cálculo automático do total
- [x] Sincronização em tempo real

### **Perfil:**
- [x] Visualizar dados do usuário
- [x] Editar nome de exibição
- [x] Avatar personalizado

### **UI/UX:**
- [x] Tema claro e escuro
- [x] Animações suaves
- [x] Feedback visual (loading, alerts)
- [x] Design responsivo
- [x] Ícones intuitivos

---

## 🔧 Utilitários

### **Alert** (`utils/Alert.ts`)

Wrapper para exibir alertas de forma consistente em diferentes plataformas (Web/Mobile).

**Funções:**
```typescript
Alert.alert(title, message, buttons?)
- Exibe alerta nativo no mobile
- Exibe window.alert na web
```

---

## 📦 Dependências Principais

- **expo-router**: Navegação baseada em arquivos
- **firebase**: Backend (Auth + Firestore)
- **@expo/vector-icons**: Ícones
- **react-native**: Framework mobile
- **typescript**: Tipagem estática

---

## 🚀 Como o App Funciona

1. **Inicialização:**
   - App inicia e carrega configurações do Firebase
   - AuthContext verifica estado de autenticação
   - ThemeContext carrega preferência de tema

2. **Autenticação:**
   - Se não autenticado, redireciona para /login
   - Usuário faz login ou se cadastra
   - Credenciais validadas pelo Firebase Auth

3. **Tela Principal:**
   - Subscription em tempo real iniciada
   - Itens carregados do Firestore
   - UI atualiza automaticamente com mudanças

4. **Gerenciamento:**
   - CRUD completo de itens
   - Busca e filtragem local
   - Cálculos em tempo real

5. **Persistência:**
   - Dados salvos no Firestore
   - Sessão mantida pelo Firebase Auth
   - Tema salvo localmente

---

## 📝 Observações Técnicas

### **Otimizações:**
- `useMemo` para cálculos pesados (filtros, totais)
- `useCallback` para funções passadas como props
- Subscription cleanup para evitar memory leaks
- Lazy loading de componentes

### **Tratamento de Erros:**
- Try/catch em todas operações async
- Mensagens de erro traduzidas
- Feedback visual de erros
- Logs no console para debug

### **Boas Práticas:**
- TypeScript para type safety
- Context API para estado global
- Separação de responsabilidades
- Componentes reutilizáveis
- Código documentado

---

## 🎓 Principais Conceitos Utilizados

1. **React Hooks**: useState, useEffect, useMemo, useContext
2. **Context API**: Gerenciamento de estado global
3. **Firebase Auth**: Autenticação de usuários
4. **Firestore**: Banco de dados NoSQL em tempo real
5. **Expo Router**: Navegação baseada em arquivos
6. **TypeScript**: Tipagem estática
7. **Responsive Design**: Adaptação a diferentes telas

---

## 📱 Fluxo de Navegação

```
/login ──────────────┐
   │                 │
   ├─ Fazer login    │
   │  (sucesso)      │
   │                 │
   └─> / (Home) ─────┤
         │           │
         ├─ /profile │
         │           │
         └─ Logout ──┘
              │
              └─> /login

/register ───────────┐
   │                 │
   └─ Cadastrar      │
      (sucesso)      │
      │              │
      └─> /login ────┘
```

---

## 🔒 Segurança e Privacidade

- Senhas criptografadas pelo Firebase Auth
- Regras de segurança no Firestore
- Dados isolados por usuário
- Validações client-side e server-side
- HTTPS obrigatório

---

**Desenvolvido com React Native + Expo + Firebase** 🚀
