import { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Input from "@/shared/components/Input";
import Button from "@/shared/components/Button";
import { useAddTransaction } from "../hooks/useAddTransaction";

interface Props {
  visible: boolean;
  onClose: (newDataAdded?: boolean) => void;
}

export default function AddTransactionModal({ visible, onClose }: Props) {
  const {
    name, setName,
    phone, setPhone,
    amount, setAmount,
    paid, setPaid,
    searchMember, setSearchMember,
    filteredMembers,
    handleSelectMember,
    autoDiscount,
    activePromo,
    loading,
    handleSave,
  } = useAddTransaction(() => onClose(true));

  const [showPicker, setShowPicker] = useState(false);

  const finalAmount = Number(amount || 0) - Number(autoDiscount || 0);
  const formatRupiah = (n: number) =>
    new Intl.NumberFormat("id-ID").format(n);

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <View
            style={{
              height: "90%",
              backgroundColor: "white",
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              overflow: "hidden",
            }}
          >
            {/* HEADER */}
            <LinearGradient colors={["#4f46e5", "#6366f1"]} style={{ padding: 20, paddingTop: 24, paddingBottom: 32 }}>
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-white text-2xl font-bold">Tambah Transaksi</Text>
                  <Text className="text-white/80 text-sm mt-1">Lengkapi data transaksi customer</Text>
                </View>
                <TouchableOpacity onPress={() => onClose(false)} className="bg-white/20 p-2 rounded-full">
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <View style={{ flex: 1 }}>
              <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
                
                {/* SELECT MEMBER SECTION */}
                <Text className="text-slate-500 font-semibold mb-2 ml-1">Customer</Text>
                {!name ? (
                  <TouchableOpacity 
                    onPress={() => setShowPicker(true)}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex-row justify-between items-center mb-6"
                  >
                    <Text className="text-slate-400">Pilih Member dari daftar...</Text>
                    <Ionicons name="people-outline" size={20} color="#6366f1" />
                  </TouchableOpacity>
                ) : (
                  <View className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex-row justify-between items-center mb-6">
                    <View>
                      <Text className="text-slate-900 font-bold">{name}</Text>
                      <Text className="text-slate-500 text-xs">{phone}</Text>
                    </View>
                    <TouchableOpacity onPress={() => {setName(""); setPhone("");}} className="bg-white px-3 py-1 rounded-lg border border-indigo-200">
                      <Text className="text-indigo-600 text-xs font-bold">Ganti</Text>
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

                <View className="bg-white rounded-2xl px-4 py-4 mb-5 shadow-sm border border-slate-100">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-slate-700 font-medium">Status Pembayaran</Text>
                    <View className="flex-row items-center">
                      <Text className={`mr-2 font-semibold ${paid ? "text-emerald-500" : "text-red-500"}`}>{paid ? "Paid" : "Unpaid"}</Text>
                      <Switch value={paid} onValueChange={setPaid} trackColor={{ false: "#fecaca", true: "#bbf7d0" }} thumbColor={paid ? "#16a34a" : "#dc2626"} />
                    </View>
                  </View>
                </View>

                {autoDiscount > 0 && (
                  <View className="bg-emerald-50 rounded-2xl p-4 mb-5 border border-emerald-100 flex-row items-center gap-2">
                    <Ionicons name="gift" size={20} color="#059669" />
                    <Text className="text-emerald-700 font-medium flex-1">Promo terpakai: Potongan {formatRupiah(autoDiscount)}</Text>
                  </View>
                )}

                <View className="bg-indigo-600 rounded-3xl p-6 mb-6">
                  <Text className="text-white/80 text-sm">Total Bayar</Text>
                  <Text className="text-white text-3xl font-bold mt-1">Rp {formatRupiah(finalAmount)}</Text>
                </View>
              </ScrollView>

              <View className="px-5 py-4 border-t border-slate-100 bg-white">
                <Button title="Simpan Transaksi" onPress={handleSave} loading={loading} disabled={!name || loading} />
              </View>
            </View>
          </View>
        </View>

        {/* MODAL PICKER (OVERLAY) */}
        {showPicker && (
          <View className="absolute inset-0 bg-white z-[9999]">
             <SafeAreaView className="flex-1">
                <View className="p-4 border-b border-slate-100 flex-row items-center">
                  <TouchableOpacity onPress={() => setShowPicker(false)} className="p-2">
                    <Ionicons name="arrow-back" size={24} color="#1e293b" />
                  </TouchableOpacity>
                  <Text className="text-xl font-bold ml-2">Pilih Member</Text>
                </View>
                <View className="p-4">
                  <Input placeholder="Cari nama atau no HP..." value={searchMember} onChangeText={setSearchMember} icon="search-outline" />
                </View>
                <ScrollView className="flex-1 px-4">
                  {filteredMembers.map(m => (
                    <TouchableOpacity 
                      key={m.id} 
                      onPress={() => { handleSelectMember(m); setShowPicker(false); }}
                      className="py-4 border-b border-slate-100 flex-row justify-between items-center"
                    >
                      <View>
                        <Text className="text-slate-800 font-bold">{m.name}</Text>
                        <Text className="text-slate-500 text-xs mt-1">{m.phone}</Text>
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
