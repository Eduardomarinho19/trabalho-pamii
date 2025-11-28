import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    User
} from 'firebase/auth';
import { auth } from '../database/services/firebaseConfig';

// Cadastrar novo usuário
export const registerUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Erro ao cadastrar usuário:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Fazer login
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Fazer logout
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};

// Observar mudanças no estado de autenticação
export const observeAuthState = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Obter usuário atual
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Enviar email de recuperação de senha
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Erro ao enviar email de recuperação:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Traduzir mensagens de erro
const getAuthErrorMessage = (errorCode: string): string => {
  const errorMessages: { [key: string]: string } = {
    'auth/email-already-in-use': 'Este e-mail já está cadastrado',
    'auth/invalid-email': 'E-mail inválido',
    'auth/operation-not-allowed': 'Operação não permitida',
    'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres',
    'auth/user-disabled': 'Usuário desabilitado',
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'auth/invalid-credential': 'Credenciais inválidas',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
  };

  return errorMessages[errorCode] || 'Erro ao processar requisição';
};
