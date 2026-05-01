import { useState, useEffect } from "react";
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
  onClose: (newDataAdded?: boolean) => void;
}

export default function AddTransactionModal({ visible, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [paid, setPaid] = useState(true);

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [activePromo, setActivePromo] = useState<any>(null);
  const [transactionCount, setTransactionCount] = useState(0);
  const [autoDiscount, setAutoDiscount] = useState(0);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (visible) {
      setName(""); setPhone(""); setAmount(""); setPaid(true);
      setSuggestions([]); setAutoDiscount(0); setTransactionCount(0);
      fetchPromo();
    }
  }, [visible]);

  const fetchPromo = async () => {
    const { data } = await supabase
      .from("promo")
      .select("*")
      .eq("is_active", true)
      .single();

    if (data) setActivePromo(data);
  };

  useEffect(() => {
    if (name.length === 0) {
      setSuggestions([]);
      return;
    }

    const fetchMembers = async () => {
      const { data } = await supabase
        .from("members")
        .select("*")
        .ilike("name", `%${name}%`)
        .limit(5);

      if (data) setSuggestions(data);
    };

    fetchMembers();
  }, [name]);

  useEffect(() => {
    if (!phone) return;

    const fetchCount = async () => {
      const { data } = await supabase
        .from("transactions")
        .select("transaction_count")
        .eq("phone", phone)
        .order("transaction_count", { ascending: false })
        .limit(1);

      const last = data && data.length > 0 ? data[0].transaction_count : 0;
      setTransactionCount(last);
    };

    fetchCount();
  }, [phone]);

  useEffect(() => {
    if (!amount || !activePromo) {
      setAutoDiscount(0);
      return;
    }

    const nextCount = transactionCount + 1;

    if (
      nextCount >= activePromo.target_transaction &&
      Number(amount) >= activePromo.minimum_amount
    ) {
      const discount = (Number(amount) * activePromo.discount_percent) / 100;
      setAutoDiscount(discount);
    } else {
      setAutoDiscount(0);
    }
  }, [amount, transactionCount, activePromo]);

  const finalAmount = Number(amount || 0) - Number(autoDiscount || 0);

  const formatRupiah = (n: number) => new Intl.NumberFormat("id-ID").format(n);

  const handleSave = async () => {
    if (!name || !phone || !amount) {
      showToast("error", "Lengkapi semua field");
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("transactions").insert({
      name,
      phone,
      amount: Number(amount),
      discount: autoDiscount,
      paid,
      transaction_count: transactionCount + 1,
    });

    setSaving(false);

    if (error) {
      showToast("error", "Gagal menambahkan transaksi");
      return;
    }

    showToast("success", "Transaksi berhasil ditambahkan");
    onClose(true);
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
                  <Ionicons name="receipt" size={24} color="white" />
                </View>
                <Text className="text-white text-2xl font-bold ml-3">
                  Tambah Transaksi
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
            <Input
              label="Nama Customer"
              placeholder="Cari / masukkan nama"
              value={name}
              onChangeText={setName}
              icon="person-outline"
            />
            {suggestions.length > 0 && (
              <View className="bg-slate-50 rounded-2xl mb-3 border border-slate-100 overflow-hidden -mt-3">
                {suggestions.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    onPress={() => {
                      setName(s.name);
                      setPhone(s.phone);
                      setSuggestions([]);
                    }}
                    className="px-4 py-3 border-b border-slate-100 flex-row justify-between"
                  >
                    <Text className="font-interMedium text-slate-800">
                      {s.name}
                    </Text>
                    <Text className="text-slate-500 font-inter">
                      {s.phone}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <Input
              label="No HP"
              placeholder="081234567890"
              value={phone}
              onChangeText={setPhone}
              icon="call-outline"
              keyboardType="phone-pad"
            />
            <Input
              label="Harga"
              placeholder="Masukkan harga"
              value={amount}
              onChangeText={setAmount}
              icon="cash-outline"
              keyboardType="number-pad"
            />

            <View className="flex-row items-center justify-between bg-slate-50 rounded-2xl px-4 py-4 mb-5 border border-slate-100">
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

            {autoDiscount > 0 && (
              <View className="bg-emerald-50 rounded-2xl p-4 mb-5 border border-emerald-100">
                <Text className="text-emerald-700 font-interMedium">
                  🎉 Promo terpakai (-{activePromo?.discount_percent}%)
                </Text>
              </View>
            )}

            <View className="bg-indigo-50 rounded-2xl p-4 mb-5 border border-indigo-100">
              <Text className="text-indigo-500 font-inter text-sm">
                Total Bayar
              </Text>
              <Text className="text-indigo-700 text-xl font-interBold mt-1">
                Rp {formatRupiah(finalAmount)}
              </Text>
            </View>

            <View className="flex-row gap-3 mb-4">
              <Button
                title="Batal"
                onPress={() => onClose(false)}
                variant="outline"
                size="lg"
                fullWidth
              />
              <Button
                title="Simpan"
                onPress={handleSave}
                loading={saving}
                disabled={saving}
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