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
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Input from "@/shared/components/Input";
import Button from "@/shared/components/Button";
import { useUpdateTransaction } from "../hooks/useUpdateTransaction";

interface Props {
  visible: boolean;
  data: any;
  onClose: (updated?: boolean) => void;
}

export default function EditTransactionModal({ visible, data, onClose }: Props) {
  const [amount, setAmount] = useState("");
  const [discount, setDiscount] = useState("");
  const [paid, setPaid] = useState(true);

  const { handleUpdate, loading } = useUpdateTransaction(() =>
    onClose(true)
  );

  useEffect(() => {
    if (visible && data) {
      setAmount(String(data.amount || 0));
      setDiscount(String(data.discount || 0));
      setPaid(data.paid);
    }
  }, [visible, data]);

  const finalAmount = Number(amount || 0) - Number(discount || 0);
  const formatRupiah = (n: number) =>
    new Intl.NumberFormat("id-ID").format(n);

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View className="flex-1 justify-end">
          <View className="bg-white overflow-hidden" style={{ borderTopLeftRadius: 32, borderTopRightRadius: 32, height: "90%"}}>

            <LinearGradient
              colors={["#4f46e5", "#6366f1"]}
              className="px-6 pt-6 pb-8"
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-white text-2xl font-bold">
                    Edit Transaksi
                  </Text>
                  <Text className="text-white/80 text-sm mt-1">
                    Update data transaksi
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => onClose(false)}
                  className="bg-white/20 p-2 rounded-full"
                >
                  <Ionicons name="close" size={22} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* CONTENT */}
            <View style={{ flex: 1 }}>

              <ScrollView
                className="px-6"
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                {/* CUSTOMER */}
                <View className="bg-white rounded-2xl p-4 mb-5 shadow-sm border border-slate-100">
                  <Text className="text-slate-400 text-xs">Customer</Text>
                  <Text className="text-lg font-semibold text-slate-800 mt-1">
                    {data?.name}
                  </Text>
                  <Text className="text-slate-500 text-sm">
                    {data?.phone}
                  </Text>
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
                <View className="bg-white rounded-2xl px-4 py-4 mb-5 shadow-sm border border-slate-100">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-slate-700 font-medium">
                      Status Pembayaran
                    </Text>

                    <View className="flex-row items-center">
                      <Text
                        className={`mr-2 font-semibold ${paid ? "text-emerald-500" : "text-red-500"
                          }`}
                      >
                        {paid ? "Paid" : "Unpaid"}
                      </Text>

                      <Switch
                        value={paid}
                        onValueChange={setPaid}
                        trackColor={{ false: "#fecaca", true: "#bbf7d0" }}
                        thumbColor={paid ? "#16a34a" : "#dc2626"}
                      />
                    </View>
                  </View>
                </View>

                {/* TOTAL */}
                <View className="bg-indigo-600 rounded-2xl p-5 mb-6">
                  <Text className="text-white/80 text-sm">Total Bayar</Text>
                  <Text className="text-white text-2xl font-bold mt-1">
                    Rp {formatRupiah(finalAmount)}
                  </Text>
                </View>
              </ScrollView>

              {/* BUTTON FIXED */}
              <View className="px-6 py-4 bg-white border-t border-slate-200">
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
