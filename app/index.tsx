import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Button, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { logoutUser } from "../services/authService";
import { addItem, deleteItem as deleteItemService, Item, subscribeToItems, updateItem } from "../services/firebaseService";

export default function HomeScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    // Escutar mudanças em tempo real do Firebase
    const unsubscribe = subscribeToItems((newItems) => {
      console.log('Items atualizados:', newItems.length, 'itens');
      setItems(newItems);
    });
    
    // Cleanup da subscription quando o componente for desmontado
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setPrice(String(editing.price));
      setDescription(editing.description ?? "");
      setCategory(editing.category ?? "");
    } else {
      setName("");
      setPrice("");
      setDescription("");
      setCategory("");
    }
  }, [editing]);

  function openCreate() {
    setEditing(null);
    setModalVisible(true);
  }

  function openEdit(item: Item) {
    setEditing(item);
    setModalVisible(true);
  }

  async function saveItem() {
    const parsedPrice = Number(price) || 0;
    
    if (!name.trim()) {
      Alert.alert('Erro', 'Nome do item é obrigatório!');
      return;
    }

    setLoading(true);

    try {
      if (editing && editing.id) {
        await updateItem(editing.id, {
          name: name.trim(),
          price: parsedPrice,
          description: description.trim(),
          category: category.trim(),
        });
        
        Alert.alert('Sucesso', 'Item editado com sucesso!');
      } else {
        const newItem = {
          name: name.trim(),
          price: parsedPrice,
          description: description.trim() || '',
          category: category.trim() || '',
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
      setName("");
      setPrice("");
      setDescription("");
      setCategory("");
      
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      Alert.alert('Erro', `Falha ao salvar: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteItem(id: string) {
    try {
      await deleteItemService(id);
    } catch (error) {
      console.error('Erro ao deletar item:', error);
      Alert.alert('Erro', 'Não foi possível deletar o item. Tente novamente.');
    }
  }

  async function handleLogout() {
    console.log('handleLogout chamado!');
    
    const confirmLogout = window.confirm('Tem certeza que deseja sair?');
    
    if (confirmLogout) {
      await performLogout();
    } else {
      console.log('Logout cancelado');
    }
  }

  async function performLogout() {
    try {
      console.log('Fazendo logout...');
      await logoutUser();
      console.log('Logout concluído, redirecionando para login...');
      router.push('/login' as any);
      console.log('Router.push executado');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      alert('Erro ao fazer logout. Tente novamente.');
    }
  }



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Lista de Compras</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.controls}>
        <Button title="Adicionar item" onPress={openCreate} />
      </View>


      <FlatList
        data={items}
        keyExtractor={(i) => i.id || `${Date.now()}-${Math.random()}`}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum item. Clique em &quot;Adicionar item&quot;.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>
                {item.name} — R$ {item.price.toFixed(2)}
              </Text>
              {item.category ? <Text style={styles.muted}>{item.category}</Text> : null}
              {item.description ? <Text style={styles.muted}>{item.description}</Text> : null}
            </View>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => openEdit(item)} style={styles.actionBtn}>
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => item.id && handleDeleteItem(item.id)} 
                style={[styles.actionBtn, { backgroundColor: "#d9534f" }]}
              >
                <Text style={[styles.actionText, { color: "#fff" }]}>Apagar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modal}>
          <Text style={styles.title}>{editing ? "Editar item" : "Novo item"}</Text>

          <Text style={styles.label}>Nome do item</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ex: Arroz" />

          <Text style={styles.label}>Valor do item</Text>
          <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="Ex: 12.50" />

          <Text style={styles.label}>Descrição</Text>
          <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Opcional" />

          <Text style={styles.label}>Categoria</Text>
          <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Ex: Alimentação" />

          <View style={styles.modalActions}>
            <Button title="Cancelar" onPress={() => setModalVisible(false)} disabled={loading} />
            <Button title={loading ? "Salvando..." : "Salvar"} onPress={saveItem} disabled={loading} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between",
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: "#d9534f",
    paddingHorizontal: 12,
    paddingVertical: 8,
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
  controls: { marginBottom: 12 },
  empty: { textAlign: "center", marginTop: 40, color: "#666" },
  card: { flexDirection: "row", padding: 12, borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 8, marginBottom: 8, alignItems: "center" },
  itemName: { fontSize: 16, fontWeight: "600" },
  muted: { color: "#666", marginTop: 4 },
  actions: { marginLeft: 12, alignItems: "flex-end", gap: 6 },
  actionBtn: { paddingHorizontal: 8, paddingVertical: 6, backgroundColor: "#eee", borderRadius: 6, marginBottom: 6 },
  actionText: { color: "#333" },
  modal: { flex: 1, padding: 16, justifyContent: "center" },
  label: { marginTop: 8, marginBottom: 4, color: "#333" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 8, minHeight: 40 },
  modalActions: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
});
