import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';
import { memberApi } from '../api/member.api';
import { useToast } from '@/shared/hooks/useToast';
import { Member } from '../types';

interface Props {
  visible: boolean;
  member: Member | null;
  onClose: (updated?: boolean) => void;
}

export default function EditMemberModal({ visible, member, onClose }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (member) {
      setName(member.name);
      setPhone(member.phone);
    }
  }, [member]);

  const handleSave = async () => {
    if (!name || !phone) {
      showToast('error', 'Nama dan No HP wajib diisi');
      return;
    }

    if (!member) return;

    setLoading(true);
    try {
      await memberApi.update(member.id, { name, phone });
      showToast('success', 'Member berhasil diupdate');
      onClose(true);
    } catch (e) {
      showToast('error', 'Gagal mengupdate member');
    } finally {
      setLoading(false);
    }
  };

  if (!visible || !member) return null;

  return (
    <Modal transparent animationType="slide" visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View
            style={{
              height: '70%',
              backgroundColor: 'white',
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              overflow: 'hidden',
            }}>
            {/* HEADER */}
            <LinearGradient colors={['#4f46e5', '#6366f1']} style={{ padding: 24 }}>
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-2xl font-bold text-white">Edit Member</Text>
                  <Text className="mt-1 text-sm text-white/80">Perbarui informasi member</Text>
                </View>
                <TouchableOpacity
                  onPress={() => onClose(false)}
                  className="rounded-full bg-white/20 p-2">
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <ScrollView className="flex-1 px-6 py-6">
              <Input
                label="Nama Lengkap"
                placeholder="Masukkan nama member"
                value={name}
                onChangeText={setName}
                icon="person-outline"
              />
              <Input
                label="Nomor HP"
                placeholder="Contoh: 081234567890"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                icon="call-outline"
              />
              <View className="mt-8">
                <Button title="Simpan Perubahan" onPress={handleSave} loading={loading} />
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
