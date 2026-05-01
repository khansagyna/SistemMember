import { useState } from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import Input from '@/shared/components/Input'
import Button from '@/shared/components/Button'
import { memberApi } from '../api/member.api'
import { useToast } from '@/shared/hooks/useToast'

interface Props {
  visible: boolean
  onClose: (added?: boolean) => void
}

export default function AddMemberModal({ visible, onClose }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const handleSave = async () => {
    if (!name || !phone) {
      showToast('error', 'Nama dan No HP wajib diisi')
      return
    }

    setLoading(true)
    try {
      await memberApi.create({ name, phone })
      showToast('success', 'Member berhasil ditambahkan')
      setName('')
      setPhone('')
      onClose(true)
    } catch (e) {
      showToast('error', 'Gagal menambahkan member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal transparent animationType="slide" visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View style={{ height: '70%', backgroundColor: 'white', borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden' }}>
            {/* HEADER */}
            <LinearGradient colors={['#4f46e5', '#6366f1']} style={{ padding: 24 }}>
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-white text-2xl font-bold">Tambah Member</Text>
                  <Text className="text-white/80 text-sm mt-1">Daftarkan member baru</Text>
                </View>
                <TouchableOpacity onPress={() => onClose(false)} className="bg-white/20 p-2 rounded-full">
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
                <Button title="Simpan Member" onPress={handleSave} loading={loading} />
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
