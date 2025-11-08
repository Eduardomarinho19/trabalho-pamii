import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { Item } from '@/components/ItemsProvider';

export function ItemCard({
  item,
  onEdit,
  onDelete,
}: {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <ThemedView style={styles.card}>
      <ThemedText type="defaultSemiBold">{item.name} — R$ {item.price.toFixed(2)}</ThemedText>
      {item.category ? <ThemedText>{item.category}</ThemedText> : null}
      {item.description ? <ThemedText>{item.description}</ThemedText> : null}
      <View style={styles.actions}>
        <Button title="Editar" onPress={() => onEdit(item)} />
        <Button title="Apagar" onPress={() => onDelete(item.id)} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, borderRadius: 8, borderWidth: 1, gap: 6 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
});