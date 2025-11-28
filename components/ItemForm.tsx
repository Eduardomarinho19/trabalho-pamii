import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Item } from '../database/services/firebaseService';

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
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});

  useEffect(() => {
    setName(initial?.name ?? '');
    setPrice(initial?.price ? String(initial.price) : '');
    setDescription(initial?.description ?? '');
    setCategory(initial?.category ?? '');
    setErrors({});
  }, [initial]);

  const validateForm = (): boolean => {
    const newErrors: { name?: string; price?: string } = {};

    // Validar nome
    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Validar preço
    const priceNum = parseFloat(price);
    if (!price.trim()) {
      newErrors.price = 'Preço é obrigatório';
    } else if (isNaN(priceNum)) {
      newErrors.price = 'Preço deve ser um número válido';
    } else if (priceNum < 0) {
      newErrors.price = 'Preço não pode ser negativo';
    } else if (priceNum === 0) {
      newErrors.price = 'Preço deve ser maior que zero';
    } else if (priceNum > 999999) {
      newErrors.price = 'Preço máximo: R$ 999.999,00';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        name: name.trim(),
        price: parseFloat(price),
        description: description.trim(),
        category: category.trim(),
      });
    }
  };

  const handlePriceChange = (text: string) => {
    // Permitir apenas números, vírgula e ponto decimal
    const cleaned = text.replace(/[^0-9.,]/g, '');
    
    // Substituir vírgula por ponto para cálculos internos
    const normalized = cleaned.replace(',', '.');
    
    // Garantir apenas um separador decimal
    const parts = normalized.split('.');
    if (parts.length > 2) {
      setPrice(parts[0] + '.' + parts.slice(1).join(''));
    } else {
      setPrice(normalized);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome do item</Text>
      <TextInput 
        style={[styles.input, errors.name && styles.inputError]} 
        value={name} 
        onChangeText={(text) => {
          setName(text);
          if (errors.name) setErrors({ ...errors, name: undefined });
        }}
        placeholder="Ex: Arroz" 
        editable={!loading}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <Text style={styles.label}>Valor do item</Text>
      <View style={[styles.priceInputContainer, errors.price && styles.inputError]}>
        <Text style={styles.currencySymbol}>R$</Text>
        <TextInput
          style={styles.priceInput}
          value={price}
          onChangeText={(text) => {
            handlePriceChange(text);
            if (errors.price) setErrors({ ...errors, price: undefined });
          }}
          keyboardType="decimal-pad"
          placeholder="0,00"
          editable={!loading}
        />
      </View>
      {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

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
          onPress={handleSubmit}
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
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
    paddingLeft: 12,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    padding: 10,
    minHeight: 40,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#d9534f",
    borderWidth: 2,
  },
  errorText: {
    color: "#d9534f",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
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