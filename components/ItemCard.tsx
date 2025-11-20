import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Theme } from '../constants/theme';
import { Item } from '../services/firebaseService';

export function ItemCard({
  item,
  onEdit,
  onDelete,
  theme,
}: {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  theme: Theme;
}) {
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.itemName, { color: theme.text }]}>
          {item.name} — R$ {item.price.toFixed(2)}
        </Text>
        {item.category ? (
          <View style={styles.categoryBadge}>
            <Ionicons name="pricetag" size={12} color={theme.primary} />
            <Text style={[styles.categoryText, { color: theme.primary }]}>{item.category}</Text>
          </View>
        ) : null}
        {item.description ? <Text style={[styles.muted, { color: theme.textSecondary }]}>{item.description}</Text> : null}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(item)} style={[styles.actionBtn, { backgroundColor: theme.surface }]}>
          <Ionicons name="pencil" size={16} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => item.id && onDelete(item.id)} 
          style={[styles.actionBtn, { backgroundColor: theme.danger }]}
        >
          <Ionicons name="trash" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { 
    flexDirection: "row", 
    padding: 12, 
    borderWidth: 1, 
    borderRadius: 8, 
    marginBottom: 8, 
    alignItems: "center",
  },
  itemName: { fontSize: 16, fontWeight: "600" },
  muted: { marginTop: 4, fontSize: 13 },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "500",
  },
  actions: { marginLeft: 12, alignItems: "flex-end", gap: 6 },
  actionBtn: { 
    paddingHorizontal: 10, 
    paddingVertical: 8, 
    borderRadius: 6, 
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});