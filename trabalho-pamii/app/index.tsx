import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Modal, StyleSheet, TouchableOpacity } from "react-native";

type Item = {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  createdAt: number;
};

export default function HomeScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

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

  function saveItem() {
    const parsedPrice = Number(price) || 0;
    if (!name.trim()) return; // simples validação

    if (editing) {
      setItems((s) =>
        s.map((it) => (it.id === editing.id ? { ...it, name: name.trim(), price: parsedPrice, description: description.trim(), category: category.trim() } : it))
      );
    } else {
      const newItem: Item = {
        id: `${Date.now()}`,
        name: name.trim(),
        price: parsedPrice,
        description: description.trim(),
        category: category.trim(),
        createdAt: Date.now(),
      };
      setItems((s) => [newItem, ...s]);
    }
    setModalVisible(false);
  }

  function deleteItem(id: string) {
    setItems((s) => s.filter((it) => it.id !== id));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Compras</Text>

      <View style={styles.controls}>
        <Button title="Adicionar item" onPress={openCreate} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum item. Clique em "Adicionar item".</Text>}
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
              <TouchableOpacity onPress={() => deleteItem(item.id)} style={[styles.actionBtn, { backgroundColor: "#d9534f" }]}>
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
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
            <Button title="Salvar" onPress={saveItem} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
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
