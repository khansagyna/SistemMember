import { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Input from "@/shared/components/Input";
import Button from "@/shared/components/Button";
import { useToast } from "@/shared/hooks/useToast";

interface Props {
  visible: boolean;
  data: any;
  onClose: (updated?: boolean) => void;
}

export default function EditTransactionModal({ visible, data, onClose }: Props) {
  const [amount, setAmount] = useState("");
  const [discount, setDiscount] = useState("");
  const [paid, setPaid] = useState(true);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (visible && data) {
      setAmount(String(data.amount || 0));
      setDiscount(String(data.discount || 0));
      setPaid(data.paid);
    } else {
      setAmount("");
      setDiscount("");
      setPaid(true);
    }
  }, [visible, data]);

  const finalAmount = Number(amount || 0) - Number(discount || 0);
  const formatRupiah = (n: number) => new Intl.NumberFormat("id-ID").format(n);

  const handleUpdate = async () => {
    if (!amount) {
      showToast("error", "Harga tidak boleh kosong");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from("transactions")
        .update({
          amount: Number(amount),
          discount: Number(discount),
          paid,
        })
        .eq("id", data.id);

      if (error) throw error;

      showToast("success", "Transaksi berhasil diupdate");
      onClose(true);
    } catch (err) {
      showToast("error", "Gagal update transaksi");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 bg-black/40 justify-end"
      >
        <ScrollView
          className="bg-white rounded-t-4xl"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <LinearGradient
            colors={["#1e3a8a", "#3b82f6"]}
            className="rounded-t-4xl px-6 py-6"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center">
                  <Ionicons name="pencil" size={24} color="white" />
                </View>
                <Text className="text-white text-2xl font-bold ml-3">
                  Edit Transaksi
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => onClose(false)}
                className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View className="px-6 py-6 flex-1">
            {/* Customer Info */}
            <View className="bg-slate-50 rounded-2xl p-4 mb-5 border border-slate-100">
              <Text className="text-slate-500 text-sm font-inter">Customer</Text>
              <Text className="text-lg font-interBold text-slate-800 mt-1">{data?.name}</Text>
              <Text className="text-slate-500 font-inter">{data?.phone}</Text>
            </View>

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
              placeholder="Masukkan diskon (jika ada)"
              icon="pricetag-outline"
            />

            {/* Status Pembayaran */}
            <View className="flex-row items-center justify-between bg-slate-50 rounded-2xl px-4 py-4 mb-5 border border-slate-100 mt-1">
              <View className="flex-row items-center">
                <Ionicons
                  name="card-outline"
                  size={20}
                  color="#64748b"
                  style={{ marginRight: 10 }}
                />
                <Text className="font-interMedium text-slate-700">
                  Status Pembayaran
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text
                  className={`font-interMedium mr-2 ${
                    paid ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {paid ? "Paid" : "Unpaid"}
                </Text>
                <Switch
                  value={paid}
                  onValueChange={setPaid}
                  trackColor={{ false: "#fecaca", true: "#a7f3d0" }}
                  thumbColor={paid ? "#059669" : "#ef4444"}
                />
              </View>
            </View>

            {/* Total Bayar */}
            <View className="bg-indigo-50 rounded-2xl p-4 mb-5 border border-indigo-100">
              <Text className="text-indigo-500 font-inter text-sm">Total Bayar</Text>
              <Text className="text-indigo-700 text-xl font-interBold mt-1">
                Rp {formatRupiah(finalAmount)}
              </Text>
            </View>

            {/* Buttons */}
            <View className="flex-row gap-3 mb-4">
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
                  title="Update"
                  onPress={handleUpdate}
                  loading={loading}
                  disabled={loading}
                  size="lg"
                  fullWidth
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}