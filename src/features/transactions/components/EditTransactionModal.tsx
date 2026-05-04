import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';
import { useUpdateTransaction } from '../hooks/useUpdateTransaction';

interface Props {
  visible: boolean;
  data: any;
  onClose: (updated?: boolean) => void;
}

export default function EditTransactionModal({ visible, data, onClose }: Props) {
  const [amount, setAmount] = useState('');
  const [discount, setDiscount] = useState('');
  const [paid, setPaid] = useState(true);

  const { handleUpdate, loading } = useUpdateTransaction(() => onClose(true));

  useEffect(() => {
    if (visible && data) {
      setAmount(String(data.amount || 0));
      setDiscount(String(data.discount || 0));
      setPaid(data.paid);
    }
  }, [visible, data]);

  const finalAmount = Number(amount || 0) - Number(discount || 0);
  const formatRupiah = (n: number) => new Intl.NumberFormat('id-ID').format(n);

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View className="flex-1 justify-end">
          <View
            className="overflow-hidden bg-white"
            style={{ borderTopLeftRadius: 32, borderTopRightRadius: 32, height: '90%' }}>
            <LinearGradient colors={['#4f46e5', '#6366f1']} className="px-6 pb-8 pt-6">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-2xl font-bold text-white">Edit Transaksi</Text>
                  <Text className="mt-1 text-sm text-white/80">Update data transaksi</Text>
                </View>

                <TouchableOpacity
                  onPress={() => onClose(false)}
                  className="rounded-full bg-white/20 p-2">
                  <Ionicons name="close" size={22} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* CONTENT */}
            <View style={{ flex: 1 }}>
              <ScrollView
                style={{ flex: 1 }}
                className="px-6"
                contentContainerStyle={{ paddingBottom: 20 }}>
                {/* CUSTOMER */}
                <View className="mb-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <Text className="text-xs text-slate-400">Customer</Text>
                  <Text className="mt-1 text-lg font-semibold text-slate-800">{data?.name}</Text>
                  <Text className="text-sm text-slate-500">{data?.phone}</Text>
                </View>

                {/* INPUT */}
                <Input
                  label="Harga"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="number-pad"
                  placeholder="Masukkan harga"
                  icon="cash-outline"
                />

                <Input
                  label="Diskon"
                  value={discount}
                  onChangeText={setDiscount}
                  keyboardType="number-pad"
                  placeholder="Masukkan diskon"
                  icon="pricetag-outline"
                />

                {/* STATUS */}
                <View className="mb-5 rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-medium text-slate-700">Status Pembayaran</Text>

                    <View className="flex-row items-center">
                      <Text
                        className={`mr-2 font-semibold ${
                          paid ? 'text-emerald-500' : 'text-red-500'
                        }`}>
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

                {/* TOTAL */}
                <View className="mb-6 rounded-2xl bg-indigo-600 p-5">
                  <Text className="text-sm text-white/80">Total Bayar</Text>
                  <Text className="mt-1 text-2xl font-bold text-white">
                    Rp {formatRupiah(finalAmount)}
                  </Text>
                </View>
              </ScrollView>

              {/* BUTTON FIXED */}
              <View className="border-t border-slate-200 bg-white px-6 py-4">
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Button
                      title="Batal"
                      onPress={() => onClose(false)}
                      variant="outline"
                      size="lg"
                      fullWidth
                    />
                  </View>

                  <View className="flex-1">
                    <Button
                      title="Simpan"
                      onPress={() =>
                        handleUpdate({
                          id: data.id,
                          amount: Number(amount),
                          discount: Number(discount),
                          paid,
                        })
                      }
                      loading={loading}
                      disabled={loading}
                      size="lg"
                      fullWidth
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
