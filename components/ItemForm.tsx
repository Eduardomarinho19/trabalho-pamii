import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Item } from '../services/firebaseService';

type Props = {
  initial?: Partial<Item>;
  onCancel?: () => void;
  onSubmit: (data: { name: string; price: number; description?: string; category?: string }) => void;
  loading?: boolean;
};

export function ItemForm({ initial, onCancel, onSubmit, loading = false }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [price, setPrice] = useState(String(initial?.price ?? ''));
  const [description, setDescription] = useState(initial?.description ?? '');
  const [category, setCategory] = useState(initial?.category ?? '');

  useEffect(() => {
    setName(initial?.name ?? '');
    setPrice(initial?.price ? String(initial.price) : '');
    setDescription(initial?.description ?? '');
    setCategory(initial?.category ?? '');
  }, [initial]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome do item</Text>
      <TextInput 
        style={styles.input} 
        value={name} 
        onChangeText={setName} 
        placeholder="Ex: Arroz" 
        editable={!loading}
      />

      <Text style={styles.label}>Valor do item</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={(t) => setPrice(t)}
        keyboardType="numeric"
        placeholder="Ex: 12.50"
        editable={!loading}
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput 
        style={styles.input} 
        value={description} 
        onChangeText={setDescription} 
        placeholder="Opcional" 
        editable={!loading}
      />

      <Text style={styles.label}>Categoria</Text>
      <TextInput 
        style={styles.input} 
        value={category} 
        onChangeText={setCategory} 
        placeholder="Ex: Alimentação" 
        editable={!loading}
      />

      <View style={styles.buttons}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={onCancel}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]} 
          onPress={() =>
            onSubmit({
              name: name.trim(),
              price: Number(price) || 0,
              description: description.trim(),
              category: category.trim(),
            })
          }
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Salvar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { 
    marginTop: 8, 
    marginBottom: 4, 
    color: "#333",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    minHeight: 40,
    backgroundColor: "#fff",
  },
  buttons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  submitButton: {
    backgroundColor: "#007AFF",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});