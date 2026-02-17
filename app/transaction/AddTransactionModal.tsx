import { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  FlatList,
  Switch,
} from "react-native";
import { supabase } from "@/utils/supabase";

interface Props {
  onClose: (newDataAdded?: boolean) => void; // tipe boolean opsional
}

export default function AddTransactionModal({ onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [paid, setPaid] = useState(true);

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [activePromo, setActivePromo] = useState<any>(null);
  const [transactionCount, setTransactionCount] = useState(0);
  const [autoDiscount, setAutoDiscount] = useState(0);

  // 🔥 ambil promo aktif
  useEffect(() => {
    fetchPromo();
  }, []);

  const fetchPromo = async () => {
    const { data } = await supabase
      .from("promo")
      .select("*")
      .eq("is_active", true)
      .single();

    if (data) setActivePromo(data);
  };

  // 🔥 suggestion member
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

  // 🔥 ambil transaction_count terakhir berdasarkan phone
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

  // 🔥 hitung auto promo
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

  // 🔥 handle save
  const handleSave = async () => {
    if (!name || !phone || !amount)
      return Alert.alert("Error", "Lengkapi semua field");

    const { error } = await supabase.from("transactions").insert({
      name,
      phone,
      amount: Number(amount),
      discount: autoDiscount,
      paid,
      transaction_count: transactionCount + 1,
    });

    if (error) return Alert.alert("Error", error.message);

    onClose(true); // beri tahu parent ada data baru
  };

  return (
    <Modal transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <View style={styles.modal}>
          <Text style={styles.title}>Tambah Transaksi</Text>

          {/* Nama */}
          <TextInput
            style={styles.input}
            placeholder="Cari / Masukkan Nama"
            value={name}
            onChangeText={setName}
          />

          {suggestions.length > 0 && (
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: 120 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setName(item.name);
                    setPhone(item.phone);
                    setSuggestions([]);
                  }}
                  style={styles.suggestion}
                >
                  <Text>{item.name}</Text>
                  <Text style={{ color: "#6b7280" }}>{item.phone}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {/* Phone */}
          <TextInput
            style={styles.input}
            placeholder="No HP"
            value={phone}
            onChangeText={setPhone}
          />

          {/* Amount */}
          <TextInput
            style={styles.input}
            placeholder="Harga"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          {/* ✅ PAID / UNPAID */}
          <View style={styles.statusRow}>
            <Text style={{ fontWeight: "600" }}>Status</Text>
            <View style={styles.switchBox}>
              <Text style={{ marginRight: 8 }}>{paid ? "Paid" : "Unpaid"}</Text>
              <Switch value={paid} onValueChange={setPaid} />
            </View>
          </View>

          {/* Preview */}
          <View style={styles.preview}>
            {autoDiscount > 0 && (
              <Text style={{ color: "#16a34a", marginBottom: 5 }}>
                Promo terpakai (-{activePromo?.discount_percent}%)
              </Text>
            )}
            <Text>Total Bayar</Text>
            <Text style={styles.total}>Rp {finalAmount.toLocaleString()}</Text>
          </View>

          <TouchableOpacity style={styles.save} onPress={() => handleSave()}>
            <Text style={{ color: "white", fontWeight: "700" }}>Simpan</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onClose()}>
            <Text style={{ textAlign: "center", marginTop: 10 }}>Batal</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modal: { backgroundColor: "#fff", padding: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  title: { fontSize: 20, fontWeight: "800", marginBottom: 15 },
  input: { backgroundColor: "#f3f4f6", borderRadius: 16, padding: 15, marginTop: 10 },
  suggestion: { backgroundColor: "#e5e7eb", padding: 10, borderRadius: 12, marginTop: 5 },
  statusRow: { marginTop: 15 },
  switchBox: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  preview: { backgroundColor: "#eef2ff", padding: 15, borderRadius: 16, marginTop: 15 },
  total: { fontSize: 20, fontWeight: "800", color: "#4f46e5" },
  save: { backgroundColor: "#4f46e5", padding: 16, borderRadius: 20, alignItems: "center", marginTop: 20 },
});