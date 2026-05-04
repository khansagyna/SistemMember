import { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';
import { supabase } from '@/lib/supabase';

interface Props {
  onClose: () => void;
}

export default function AddMemberModal({ onClose }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const handleSave = async () => {
    setNameError('');
    setPhoneError('');

    if (!name) {
      setNameError('Nama wajib diisi');
      return;
    }
    if (!phone) {
      setPhoneError('No HP wajib diisi');
      return;
    }

    setLoading(true);

    const { error } = await supabase.from('members').insert({
      name,
      phone,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    Alert.alert('Success', 'Member berhasil ditambahkan');
    onClose();
  };

  return (
    <Modal transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-end bg-black/40">
        <ScrollView className="rounded-t-4xl bg-white" contentContainerStyle={{ flexGrow: 1 }}>
          {/* HEADER */}
          <LinearGradient colors={['#1e3a8a', '#3b82f6']} className="rounded-t-4xl px-6 py-6">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                  <Ionicons name="person-add" size={24} color="white" />
                </View>
                <Text className="ml-3 text-2xl font-bold text-white">Tambah Member</Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                className="h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* FORM */}
          <View className="flex-1 px-6 py-6">
            <Input
              label="Nama Member"
              placeholder="Masukkan nama"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setNameError('');
              }}
              icon="person-outline"
              error={nameError}
            />

            <Input
              label="No HP"
              placeholder="Contoh: 081234567890"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                setPhoneError('');
              }}
              keyboardType="phone-pad"
              icon="call-outline"
              error={phoneError}
            />

            <View className="flex-1" />

            <View className="mb-4 flex-row gap-3">
              <Button title="Batal" onPress={onClose} variant="outline" size="lg" fullWidth />

              <Button
                title="Simpan"
                onPress={handleSave}
                loading={loading}
                disabled={loading}
                size="lg"
                fullWidth
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
