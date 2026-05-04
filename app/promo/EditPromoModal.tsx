import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';

interface Promo {
  id: string;
  name: string;
  discount: number;
  description: string;
}

interface EditPromoModalProps {
  visible: boolean;
  promo: Promo | null;
  onClose: () => void;
  onUpdate: (promo: Promo) => void;
}

export default function EditPromoModal({ visible, promo, onClose, onUpdate }: EditPromoModalProps) {
  const [name, setName] = useState<string>('');
  const [discount, setDiscount] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    if (promo) {
      setName(promo.name);
      setDiscount(promo.discount.toString());
      setDescription(promo.description);
    }
  }, [promo]);

  const handleUpdate = () => {
    if (!promo) return;

    const updatedPromo: Promo = {
      ...promo,
      name,
      discount: Number(discount),
      description,
    };

    onUpdate(updatedPromo);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Edit Promo</Text>

          <TextInput value={name} onChangeText={setName} style={styles.input} />

          <TextInput
            value={discount}
            onChangeText={setDiscount}
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput value={description} onChangeText={setDescription} style={styles.input} />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
              <Text style={styles.btnText}>Update</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveBtn: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
  },
  cancelBtn: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
  },
});
