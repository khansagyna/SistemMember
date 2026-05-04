import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';

export interface Promo {
  id: string;
  title: string;
  transactionTarget: number;
  minimum: number;
}

interface AddPromoModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: Omit<Promo, 'id'>) => void;
}

export default function AddPromoModal({ visible, onClose, onSave }: AddPromoModalProps) {
  const [title, setTitle] = useState('');
  const [transactionTarget, setTransactionTarget] = useState('');
  const [minimum, setMinimum] = useState('');

  const handleSave = () => {
    onSave({
      title,
      transactionTarget: Number(transactionTarget),
      minimum: Number(minimum),
    });

    setTitle('');
    setTransactionTarget('');
    setMinimum('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add Promo</Text>

          <TextInput
            placeholder="Promo Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <TextInput
            placeholder="Transaction Target"
            value={transactionTarget}
            onChangeText={setTransactionTarget}
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            placeholder="Minimum Transaction"
            value={minimum}
            onChangeText={setMinimum}
            keyboardType="numeric"
            style={styles.input}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.btnText}>Save</Text>
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
    backgroundColor: '#4CAF50',
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
