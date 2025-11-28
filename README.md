# 🛒 Lista de Compras

Aplicativo de lista de compras desenvolvido com React Native, Expo e Firebase. Permite que usuários gerenciem seus itens de compra de forma simples e eficiente, com sincronização em tempo real e suporte para múltiplas plataformas (iOS, Android e Web).

## 📋 Funcionalidades

- **Autenticação de Usuários**
  - Cadastro e login com email e senha
  - Recuperação de senha via email
  - Perfil de usuário editável
  - Logout seguro

- **Gerenciamento de Itens**
  - Adicionar novos itens à lista
  - Editar itens existentes
  - Excluir itens
  - Busca por nome ou descrição
  - Visualização do valor total da lista

- **Interface**
  - Tema claro e escuro
  - Design responsivo para web e mobile
  - Sincronização em tempo real com Firebase
  - Validação de formulários

- **Segurança**
  - Dados isolados por usuário
  - Regras de segurança no Firestore
  - Credenciais gerenciadas por variáveis de ambiente

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI (instalado globalmente ou via npx)

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Eduardomarinho19/trabalho-pamii.git
   cd trabalho-pamii
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   
   O arquivo `.env` já está incluído no repositório com as credenciais do Firebase configuradas.

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm start
   ```
   
   ou
   
   ```bash
   npx expo start
   ```

5. **Execute o aplicativo**
   
   Após iniciar, você terá as seguintes opções:
   - Pressione `w` para abrir no navegador (web)
   - Pressione `a` para abrir no emulador Android
   - Pressione `i` para abrir no simulador iOS
   - Escaneie o QR Code com o app Expo Go no seu smartphone

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento universal
- **TypeScript** - Tipagem estática para JavaScript
- **Firebase Authentication** - Autenticação de usuários
- **Cloud Firestore** - Banco de dados NoSQL em tempo real
- **Expo Router** - Navegação baseada em arquivos
- **Context API** - Gerenciamento de estado global

## 📁 Estrutura do Projeto

```
trabalho-pamii/
├── app/                    # Telas da aplicação (Expo Router)
│   ├── index.tsx          # Tela principal (lista de itens)
│   ├── login.tsx          # Tela de login
│   ├── register.tsx       # Tela de cadastro
│   ├── profile.tsx        # Tela de perfil
│   └── reset-password.tsx # Recuperação de senha
├── components/            # Componentes reutilizáveis
│   ├── ItemCard.tsx      # Card de exibição de item
│   └── ItemForm.tsx      # Formulário de item
├── contexts/             # Contextos React
│   ├── AuthContext.tsx   # Autenticação
│   └── ThemeContext.tsx  # Tema claro/escuro
├── database/             # Configurações do Firebase
│   └── services/
│       ├── firebaseConfig.ts
│       └── firebaseService.ts
├── services/             # Serviços da aplicação
│   ├── authService.ts    # Serviços de autenticação
│   └── userService.ts    # Serviços de usuário
├── utils/                # Utilitários
│   └── Alert.ts          # Alert universal (web/mobile)
├── constants/            # Constantes
│   └── theme.ts          # Configurações de tema
└── .env                  # Variáveis de ambiente
```

## 👤 Autor

Desenvolvido para a disciplina de Programação para Aplicativos Móveis II.

## 📄 Licença

Este projeto é de código aberto e está disponível para fins educacionais.

