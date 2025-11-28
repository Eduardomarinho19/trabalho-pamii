import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { registerUser } from '../services/authService';
import { Alert } from '../utils/Alert';

export default function RegisterScreen() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validação de email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleRegister = async () => {
    // Validações
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (!isValidEmail(email.trim())) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await registerUser(email.trim(), password);
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso! Faça login para continuar.');
      router.push('/login');
    } catch (error) {
      console.error('Erro no cadastro:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao cadastrar';
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Cadastre-se para começar</Text>

          <View style={styles.form}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholderTextColor="#999"
              editable={!loading}
            />

            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Mínimo 6 caracteres"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
                placeholderTextColor="#999"
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.6}
              >
                <Ionicons 
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'} 
                  size={22} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Confirmar Senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Digite a senha novamente"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                editable={!loading}
                placeholderTextColor="#999"
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                activeOpacity={0.6}
              >
                <Ionicons 
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} 
                  size={22} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Cadastrar</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Já tem uma conta?</Text>
              <TouchableOpacity onPress={navigateToLogin} disabled={loading}>
                <Text style={styles.link}>Fazer login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  eyeIcon: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 4,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  link: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
