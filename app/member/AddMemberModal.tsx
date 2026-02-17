import { useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import { supabase } from "@/utils/supabase";

interface Props {
  onClose: () => void;
}

export default function AddMemberModal({ onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !phone)
      return Alert.alert("Error", "Semua field wajib diisi");

    setLoading(true);

    const { error } = await supabase.from("members").insert({
      name,
      phone,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    Alert.alert("Success", "Member berhasil ditambahkan");
    onClose();
  };

  return (
    <Modal transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <View style={styles.modal}>
          <Text style={styles.title}>Tambah Member</Text>

          <TextInput
            style={styles.input}
            placeholder="Nama"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="No HP"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <TouchableOpacity
            style={styles.save}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.saveText}>Simpan</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancel}>Batal</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    padding: 15,
    marginTop: 10,
  },
  save: {
    backgroundColor: "#4f46e5",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: {
    color: "white",
    fontWeight: "700",
  },
  cancel: {
    textAlign: "center",
    marginTop: 15,
    color: "#6b7280",
  },
});