import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
import { resetPassword } from '../services/authService';
import { Alert } from '../utils/Alert';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Validação de email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    // Validações
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, insira seu e-mail');
      return;
    }

    if (!isValidEmail(email.trim())) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email.trim());
      
      Alert.alert(
        'E-mail Enviado',
        'Um e-mail com instruções para redefinir sua senha foi enviado. Verifique sua caixa de entrada.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar e-mail de recuperação';
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
          {/* Botão Voltar */}
          <TouchableOpacity style={styles.backButton} onPress={navigateToLogin}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <Ionicons name="lock-closed-outline" size={80} color="#007AFF" />
          </View>

          <Text style={styles.title}>Esqueceu sua senha?</Text>
          <Text style={styles.subtitle}>
            Digite seu e-mail e enviaremos instruções para redefinir sua senha
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>E-mail</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!loading}
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="paper-plane-outline" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Enviar E-mail</Text>
                </>
              )}
            </TouchableOpacity>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
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
    lineHeight: 22,
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
