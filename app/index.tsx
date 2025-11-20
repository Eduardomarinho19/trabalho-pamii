import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Modal, Platform, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ItemCard } from "../components/ItemCard";
import { ItemForm } from "../components/ItemForm";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { logoutUser } from "../services/authService";
import { addItem, deleteItem as deleteItemService, Item, subscribeToItems, updateItem } from "../services/firebaseService";

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [items, setItems] = useState<Item[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    // Escutar mudanças em tempo real do Firebase
    const unsubscribe = subscribeToItems((newItems) => {
      setItems(newItems);
    });
    
    // Cleanup da subscription quando o componente for desmontado
    return () => unsubscribe();
  }, []);

  // Categorias únicas disponíveis
  const categories = useMemo(() => {
    const cats = new Set<string>();
    items.forEach(item => {
      if (item.category && item.category.trim()) {
        cats.add(item.category.trim());
      }
    });
    return Array.from(cats).sort();
  }, [items]);

  // Filtrar itens por busca e categoria
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = searchText === "" || 
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchText.toLowerCase()));
      
      const matchesCategory = selectedCategory === null || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [items, searchText, selectedCategory]);

  // Calcular total dos itens filtrados
  const totalValue = useMemo(() => {
    return filteredItems.reduce((sum, item) => sum + item.price, 0);
  }, [filteredItems]);

  function openCreate() {
    setEditing(null);
    setModalVisible(true);
  }

  function openEdit(item: Item) {
    setEditing(item);
    setModalVisible(true);
  }

  async function saveItem(data: { name: string; price: number; description?: string; category?: string }) {
    if (!data.name.trim()) {
      Alert.alert('Erro', 'Nome do item é obrigatório!');
      return;
    }

    setLoading(true);

    try {
      if (editing && editing.id) {
        await updateItem(editing.id, {
          name: data.name,
          price: data.price,
          description: data.description,
          category: data.category,
        });
        
        Alert.alert('Sucesso', 'Item editado com sucesso!');
      } else {
        const newItem = {
          name: data.name,
          price: data.price,
          description: data.description || '',
          category: data.category || '',
        };
        
        const itemId = await addItem(newItem);
        console.log('Item adicionado com ID:', itemId);
        
        if (itemId) {
          Alert.alert('Sucesso', 'Item adicionado com sucesso!');
        } else {
          throw new Error('Falha ao adicionar item');
        }
      }
      
      setModalVisible(false);
      setEditing(null);
      
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      Alert.alert('Erro', `Falha ao salvar: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteItem(id: string) {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja apagar este item?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteItemService(id);
              Alert.alert('Sucesso', 'Item removido com sucesso!');
            } catch (error) {
              console.error('Erro ao deletar item:', error);
              Alert.alert('Erro', 'Não foi possível deletar o item. Tente novamente.');
            }
          },
        },
      ]
    );
  }

  async function handleLogout() {
    console.log('handleLogout chamado');
    
    if (Platform.OS === 'web') {
      // No web, usar window.confirm
      const confirmLogout = window.confirm('Tem certeza que deseja sair?');
      console.log('Confirmação:', confirmLogout);
      if (confirmLogout) {
        await performLogout();
      }
    } else {
      // No mobile, usar Alert.alert
      Alert.alert(
        'Confirmar Saída',
        'Tem certeza que deseja sair?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Sair',
            style: 'destructive',
            onPress: performLogout,
          },
        ]
      );
    }
  }

  async function performLogout() {
    try {
      setLoading(true);
      console.log('Fazendo logout...');
      await logoutUser();
      console.log('Logout concluído com sucesso');
      // Força o redirecionamento imediatamente
      router.replace('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      if (Platform.OS === 'web') {
        window.alert('Erro ao fazer logout. Tente novamente.');
      } else {
        Alert.alert('Erro', 'Erro ao fazer logout. Tente novamente.');
      }
      setLoading(false);
    }
  }

  // Mostrar loading enquanto verifica autenticação
  if (authLoading) {
    return (
      <View style={[styles(theme).container, styles(theme).centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles(theme).loadingText, { color: theme.text }]}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={[styles(theme).container, { backgroundColor: theme.background }]}>
      <View style={styles(theme).header}>
        {/* Toggle Dark Mode */}
        <View style={styles(theme).themeToggle}>
          <Ionicons 
            name={isDarkMode ? "moon" : "sunny"} 
            size={20} 
            color={theme.text} 
          />
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: theme.primary }}
            thumbColor={isDarkMode ? "#f4f3f4" : "#f4f3f4"}
          />
        </View>
        
        <Text style={[styles(theme).title, { color: theme.text }]}>Lista de Compras</Text>
        
        <View style={styles(theme).headerActions}>
          <TouchableOpacity onPress={() => router.push('/profile')} style={styles(theme).iconButton}>
            <Ionicons name="person-circle-outline" size={28} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles(theme).logoutButton, { backgroundColor: theme.danger }]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Barra de busca */}
      <View style={[styles(theme).searchContainer, { backgroundColor: theme.inputBackground }]}>
        <Ionicons name="search" size={20} color={theme.textSecondary} style={styles(theme).searchIcon} />
        <TextInput
          style={[styles(theme).searchInput, { color: theme.text }]}
          placeholder="Buscar itens..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={theme.textMuted}
        />
        {searchText !== "" && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros de categoria */}
      {categories.length > 0 && (
        <View style={styles(theme).categoriesContainer}>
          <TouchableOpacity
            style={[styles(theme).categoryChip, selectedCategory === null && styles(theme).categoryChipActive]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles(theme).categoryChipText, selectedCategory === null && styles(theme).categoryChipTextActive]}>
              Todas
            </Text>
          </TouchableOpacity>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles(theme).categoryChip, selectedCategory === cat && styles(theme).categoryChipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles(theme).categoryChipText, selectedCategory === cat && styles(theme).categoryChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Botão de adicionar */}
      <TouchableOpacity style={styles(theme).addButton} onPress={openCreate}>
        <Ionicons name="add-circle" size={24} color="#fff" />
        <Text style={styles(theme).addButtonText}>Adicionar Item</Text>
      </TouchableOpacity>

      {/* Total da lista */}
      {filteredItems.length > 0 && (
        <View style={styles(theme).totalContainer}>
          <Text style={styles(theme).totalLabel}>
            Total ({filteredItems.length} {filteredItems.length === 1 ? 'item' : 'itens'}):
          </Text>
          <Text style={styles(theme).totalValue}>R$ {totalValue.toFixed(2)}</Text>
        </View>
      )}

      <FlatList
        data={filteredItems}
        keyExtractor={(i) => i.id || `${Date.now()}-${Math.random()}`}
        ListEmptyComponent={
          <Text style={styles(theme).empty}>
            {searchText || selectedCategory 
              ? "Nenhum item encontrado com os filtros aplicados."
              : 'Nenhum item. Clique em "Adicionar item".'}
          </Text>
        }
        renderItem={({ item }) => (
          <ItemCard 
            item={item} 
            onEdit={openEdit} 
            onDelete={handleDeleteItem}
            theme={theme}
          />
        )}
      />

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles(theme).modal}>
          <Text style={styles(theme).modalTitle}>{editing ? "Editar item" : "Novo item"}</Text>
          
          <ItemForm
            initial={editing || undefined}
            onCancel={() => {
              setModalVisible(false);
              setEditing(null);
            }}
            onSubmit={saveItem}
            loading={loading}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = (theme: any) => StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between",
    marginBottom: 12,
  },
  themeToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  logoutButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  headerSpacer: {
    width: 60,
  },
  title: { fontSize: 22, fontWeight: "700", flex: 1, textAlign: "center" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
  },
  categoryChipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: theme.text,
  },
  categoryChipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: theme.success,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  empty: { textAlign: "center", marginTop: 40, color: theme.textSecondary },
  modal: { flex: 1, paddingTop: 60, backgroundColor: theme.background },
  modalTitle: { 
    fontSize: 24, 
    fontWeight: "700", 
    textAlign: "center",
    marginBottom: 20,
    color: theme.text,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
});
