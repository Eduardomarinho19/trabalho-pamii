import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
    getUserProfile,
    saveUserProfile,
    UserProfile,
} from '../services/userService';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userProfile = await getUserProfile(user.uid);
      
      if (userProfile) {
        setProfile(userProfile);
        setDisplayName(userProfile.displayName || '');
      } else {
        // Criar perfil inicial
        const initialProfile: Partial<UserProfile> = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
        };
        await saveUserProfile(user.uid, initialProfile);
        setProfile(initialProfile as UserProfile);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      Alert.alert('Erro', 'Não foi possível carregar o perfil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await saveUserProfile(user.uid, { displayName: displayName.trim() });
      
      if (Platform.OS === 'web') {
        window.alert('Perfil atualizado com sucesso!');
      } else {
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      }
      
      loadProfile();
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      
      if (Platform.OS === 'web') {
        window.alert('Não foi possível salvar o perfil');
      } else {
        Alert.alert('Erro', 'Não foi possível salvar o perfil');
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>Carregando...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Meu Perfil</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.content}>
          {/* Avatar simples */}
          <View style={styles.photoContainer}>
            <View style={[styles.photoWrapper, { borderColor: theme.border }]}>
              <Ionicons name="person-circle" size={120} color={theme.primary} />
            </View>
            <Text style={[styles.photoNote, { color: theme.textMuted }]}>
              Recurso de foto requer plano pago do Firebase
            </Text>
          </View>

          {/* Email (não editável) */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.text }]}>Email</Text>
            <View style={[styles.input, styles.inputDisabled, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.inputText, { color: theme.textSecondary }]}>
                {user?.email || 'N/A'}
              </Text>
            </View>
          </View>

          {/* Nome */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.text }]}>Nome</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text }]}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Seu nome"
              placeholderTextColor={theme.textMuted}
              editable={!loading}
            />
          </View>

          {/* Botão Salvar */}
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.success }]}
            onPress={handleSaveProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    padding: 20,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  photoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 2,
    marginBottom: 12,
  },
  photoNote: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  inputText: {
    fontSize: 16,
  },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
