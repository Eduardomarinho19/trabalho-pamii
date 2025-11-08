import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Button } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { Item } from '@/components/ItemsProvider';

type Props = {
  initial?: Partial<Item>;
  onCancel?: () => void;
  onSubmit: (data: { name: string; price: number; description?: string; category?: string }) => void;
};

export function ItemForm({ initial, onCancel, onSubmit }: Props) {
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
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Nome do item</ThemedText>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ex: Arroz" />

      <ThemedText type="subtitle">Valor do item</ThemedText>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={(t) => setPrice(t)}
        keyboardType="numeric"
        placeholder="Ex: 12.50"
      />

      <ThemedText type="subtitle">Descrição</ThemedText>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Opcional" />

      <ThemedText type="subtitle">Categoria</ThemedText>
      <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Ex: Alimentação" />

      <View style={styles.buttons}>
        <Button title="Cancelar" onPress={onCancel} />
        <Button
          title="Salvar"
          onPress={() =>
            onSubmit({
              name: name.trim(),
              price: Number(price) || 0,
              description: description.trim(),
              category: category.trim(),
            })
          }
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    minHeight: 40,
  },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
});