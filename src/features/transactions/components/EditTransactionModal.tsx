import { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { supabase } from "@/lib/supabase";

interface Props {
  data: any;
  onClose: (updated?: boolean) => void; // boolean opsional
}

export default function EditTransactionModal({ data, onClose }: Props) {
  const [amount, setAmount] = useState(String(data.amount));
  const [discount, setDiscount] = useState(String(data.discount));
  const [paid, setPaid] = useState(data.paid);
  const [loading, setLoading] = useState(false);

  const finalAmount = Number(amount || 0) - Number(discount || 0);

  // 🔥 handle update
  const handleUpdate = async () => {
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

      onClose(true); // beri tahu parent ada update
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.handle} />

          <Text style={styles.title}>Edit Transaksi</Text>

          <Text style={styles.label}>Harga</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <Text style={styles.label}>Diskon</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={discount}
            onChangeText={setDiscount}
          />

          <View style={styles.statusRow}>
            <Text style={styles.label}>Status</Text>
            <TouchableOpacity
              style={[styles.statusBtn, { backgroundColor: paid ? "#16a34a" : "#dc2626" }]}
              onPress={() => setPaid(!paid)}
            >
              <Text style={styles.statusText}>{paid ? "Paid" : "Unpaid"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.previewBox}>
            <Text style={styles.previewLabel}>Total Sekarang</Text>
            <Text style={styles.previewValue}>Rp {finalAmount.toLocaleString()}</Text>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={() => handleUpdate()} disabled={loading}>
            <Text style={styles.saveText}>{loading ? "Updating..." : "Update Transaksi"}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onClose()}>
            <Text style={styles.cancel}>Batal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modal: { backgroundColor: "#fff", padding: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  handle: { width: 40, height: 5, backgroundColor: "#e5e7eb", borderRadius: 10, alignSelf: "center", marginBottom: 15 },
  title: { fontSize: 20, fontWeight: "800", marginBottom: 15 },
  label: { fontWeight: "600", marginBottom: 6, marginTop: 10 },
  input: { backgroundColor: "#f3f4f6", borderRadius: 16, padding: 15 },
  statusRow: { marginTop: 15 },
  statusBtn: { padding: 12, borderRadius: 16, alignItems: "center", marginTop: 8 },
  statusText: { color: "white", fontWeight: "700" },
  previewBox: { backgroundColor: "#eef2ff", padding: 15, borderRadius: 18, marginTop: 20 },
  previewLabel: { color: "#6366f1" },
  previewValue: { fontSize: 20, fontWeight: "800", color: "#4f46e5", marginTop: 4 },
  saveBtn: { backgroundColor: "#4f46e5", padding: 16, borderRadius: 20, alignItems: "center", marginTop: 20 },
  saveText: { color: "white", fontWeight: "700" },
  cancel: { textAlign: "center", marginTop: 15, color: "#6b7280" },
});