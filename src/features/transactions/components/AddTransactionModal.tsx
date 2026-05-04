import { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';
import { useAddTransaction } from '../hooks/useAddTransaction';

interface Props {
  visible: boolean;
  onClose: (newDataAdded?: boolean) => void;
}

export default function AddTransactionModal({ visible, onClose }: Props) {
  const {
    name,
    setName,
    phone,
    setPhone,
    amount,
    setAmount,
    paid,
    setPaid,
    searchMember,
    setSearchMember,
    filteredMembers,
    handleSelectMember,
    autoDiscount,
    activePromo,
    loading,
    handleSave,
  } = useAddTransaction(() => onClose(true));

  const [showPicker, setShowPicker] = useState(false);

  const finalAmount = Number(amount || 0) - Number(autoDiscount || 0);
  const formatRupiah = (n: number) => new Intl.NumberFormat('id-ID').format(n);

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View
            style={{
              height: '90%',
              backgroundColor: 'white',
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              overflow: 'hidden',
            }}>
            {/* HEADER */}
            <LinearGradient
              colors={['#4f46e5', '#6366f1']}
              style={{ padding: 20, paddingTop: 24, paddingBottom: 32 }}>
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-2xl font-bold text-white">Tambah Transaksi</Text>
                  <Text className="mt-1 text-sm text-white/80">
                    Lengkapi data transaksi customer
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => onClose(false)}
                  className="rounded-full bg-white/20 p-2">
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <View style={{ flex: 1 }}>
              <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
                {/* SELECT MEMBER SECTION */}
                <Text className="mb-2 ml-1 font-semibold text-slate-500">Customer</Text>
                {!name ? (
                  <TouchableOpacity
                    onPress={() => setShowPicker(true)}
                    className="mb-6 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <Text className="text-slate-400">Pilih Member dari daftar...</Text>
                    <Ionicons name="people-outline" size={20} color="#6366f1" />
                  </TouchableOpacity>
                ) : (
                  <View className="mb-6 flex-row items-center justify-between rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                    <View>
                      <Text className="font-bold text-slate-900">{name}</Text>
                      <Text className="text-xs text-slate-500">{phone}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setName('');
                        setPhone('');
                      }}
                      className="rounded-lg border border-indigo-200 bg-white px-3 py-1">
                      <Text className="text-xs font-bold text-indigo-600">Ganti</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <Input
                  label="Harga Layanan"
                  placeholder="0"
                  value={amount}
                  onChangeText={setAmount}
                  icon="cash-outline"
                  keyboardType="number-pad"
                />

                <View className="mb-5 rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-medium text-slate-700">Status Pembayaran</Text>
                    <View className="flex-row items-center">
                      <Text
                        className={`mr-2 font-semibold ${paid ? 'text-emerald-500' : 'text-red-500'}`}>
                        {paid ? 'Paid' : 'Unpaid'}
                      </Text>
                      <Switch
                        value={paid}
                        onValueChange={setPaid}
                        trackColor={{ false: '#fecaca', true: '#bbf7d0' }}
                        thumbColor={paid ? '#16a34a' : '#dc2626'}
                      />
                    </View>
                  </View>
                </View>

                {autoDiscount > 0 && (
                  <View className="mb-5 flex-row items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                    <Ionicons name="gift" size={20} color="#059669" />
                    <Text className="flex-1 font-medium text-emerald-700">
                      Promo terpakai: Potongan {formatRupiah(autoDiscount)}
                    </Text>
                  </View>
                )}

                <View className="mb-6 rounded-3xl bg-indigo-600 p-6">
                  <Text className="text-sm text-white/80">Total Bayar</Text>
                  <Text className="mt-1 text-3xl font-bold text-white">
                    Rp {formatRupiah(finalAmount)}
                  </Text>
                </View>
              </ScrollView>

              <View className="border-t border-slate-100 bg-white px-5 py-4">
                <Button
                  title="Simpan Transaksi"
                  onPress={handleSave}
                  loading={loading}
                  disabled={!name || loading}
                />
              </View>
            </View>
          </View>
        </View>

        {/* MODAL PICKER (OVERLAY) */}
        {showPicker && (
          <View className="absolute inset-0 z-[9999] bg-white">
            <SafeAreaView className="flex-1">
              <View className="flex-row items-center border-b border-slate-100 p-4">
                <TouchableOpacity onPress={() => setShowPicker(false)} className="p-2">
                  <Ionicons name="arrow-back" size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text className="ml-2 text-xl font-bold">Pilih Member</Text>
              </View>
              <View className="p-4">
                <Input
                  placeholder="Cari nama atau no HP..."
                  value={searchMember}
                  onChangeText={setSearchMember}
                  icon="search-outline"
                />
              </View>
              <ScrollView className="flex-1 px-4">
                {filteredMembers.map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    onPress={() => {
                      handleSelectMember(m);
                      setShowPicker(false);
                    }}
                    className="flex-row items-center justify-between border-b border-slate-100 py-4">
                    <View>
                      <Text className="font-bold text-slate-800">{m.name}</Text>
                      <Text className="mt-1 text-xs text-slate-500">{m.phone}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </SafeAreaView>
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}
