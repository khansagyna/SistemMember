import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

interface Promo {
  id: string;
  name: string;
  target_transaction: number;
  discount_percent: number;
  minimum_amount: number;
  is_active: boolean;
}

export default function PromoPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [editing, setEditing] = useState<Promo | null>(null);

  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [percent, setPercent] = useState("");
  const [minimum, setMinimum] = useState("");

useEffect(() => {
  // Fungsi async di dalam
  const fetchPromo = async () => {
    const { data } = await supabase
      .from("promo")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setPromos(data);
  };

  fetchPromo(); // panggil async tapi jangan return

  // Realtime listener
  const channel = supabase
    .channel("promo-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "promo" },
      () => fetchPromo()
    )
    .subscribe();

  // Cleanup function
  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  const resetForm = () => {
    setEditing(null);
    setName("");
    setTarget("");
    setPercent("");
    setMinimum("");
  };

  const addPromo = async () => {
    if (!name || !target || !percent || !minimum)
      return Alert.alert("Error", "Lengkapi semua field");

    const { error } = await supabase.from("promo").insert({
      name,
      target_transaction: Number(target),
      discount_percent: Number(percent),
      minimum_amount: Number(minimum),
      is_active: false,
    });

    if (error) return Alert.alert("Error", error.message);
    resetForm();
  };

  const updatePromo = async () => {
    if (!editing) return;

    const { error } = await supabase
      .from("promo")
      .update({
        name,
        target_transaction: Number(target),
        discount_percent: Number(percent),
        minimum_amount: Number(minimum),
      })
      .eq("id", editing.id);

    if (error) return Alert.alert("Error", error.message);
    resetForm();
  };

  const deletePromo = async (id: string) => {
    Alert.alert("Hapus Promo?", "Promo akan dihapus permanen", [
      { text: "Batal" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          await supabase.from("promo").delete().eq("id", id);
        },
      },
    ]);
  };

  const toggleActive = async (id: string) => {
    await supabase.from("promo").update({ is_active: false });
    await supabase.from("promo").update({ is_active: true }).eq("id", id);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        contentContainerStyle={{ paddingBottom: 120 }}
        ListHeaderComponent={
          <>
            {/* HEADER */}
            <View className="px-6 pt-14 pb-8 bg-white rounded-b-[32px] shadow-sm">
              <Text className="text-3xl font-bold text-gray-800">
                Promo Management
              </Text>
              <Text className="text-gray-500 mt-1">
                Kelola diskon loyalitas member
              </Text>
            </View>

            {/* FORM */}
            <View className="bg-white mx-6 mt-6 p-6 rounded-3xl shadow-md">
              <Text className="text-lg font-semibold mb-5 text-gray-800">
                {editing ? "Edit Promo" : "Tambah Promo"}
              </Text>
              <TextInput
                placeholder="Nama Promo"
                value={name}
                onChangeText={setName}
                className="border border-gray-200 p-4 rounded-2xl mb-4 bg-gray-50"
              />
              <TextInput
                placeholder="Target Transaksi ke-"
                value={target}
                onChangeText={setTarget}
                keyboardType="numeric"
                className="border border-gray-200 p-4 rounded-2xl mb-4 bg-gray-50"
              />
              <TextInput
                placeholder="Diskon (%)"
                value={percent}
                onChangeText={setPercent}
                keyboardType="numeric"
                className="border border-gray-200 p-4 rounded-2xl mb-4 bg-gray-50"
              />
              <TextInput
                placeholder="Minimum Belanja"
                value={minimum}
                onChangeText={setMinimum}
                keyboardType="numeric"
                className="border border-gray-200 p-4 rounded-2xl mb-6 bg-gray-50"
              />

              <Pressable
                onPress={editing ? updatePromo : addPromo}
                className="bg-indigo-600 p-4 rounded-2xl"
              >
                <Text className="text-white text-center font-semibold">
                  {editing ? "Update Promo" : "Simpan Promo"}
                </Text>
              </Pressable>

              {editing && (
                <Pressable
                  onPress={resetForm}
                  className="mt-3 p-3 rounded-2xl bg-gray-200"
                >
                  <Text className="text-center font-semibold text-gray-600">
                    Batal Edit
                  </Text>
                </Pressable>
              )}
            </View>

            <Text className="mx-6 mt-8 mb-3 text-gray-600 font-semibold">
              Daftar Promo
            </Text>
          </>
        }
        data={promos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-white mx-6 mb-4 p-6 rounded-3xl shadow-md">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
              <View
                className={`px-3 py-1 rounded-full ${
                  item.is_active ? "bg-green-100" : "bg-gray-200"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    item.is_active ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {item.is_active ? "ACTIVE" : "INACTIVE"}
                </Text>
              </View>
            </View>

            <Text className="text-gray-600">🎯 Target: ke-{item.target_transaction}</Text>
            <Text className="text-gray-600">💸 Diskon: {item.discount_percent}%</Text>
            <Text className="text-gray-600">
              💰 Minimum: Rp {item.minimum_amount.toLocaleString()}
            </Text>

            <View className="flex-row gap-3 mt-5">
              {!item.is_active && (
                <Pressable
                  onPress={() => toggleActive(item.id)}
                  className="flex-1 bg-green-500 p-3 rounded-2xl"
                >
                  <Text className="text-white text-center font-semibold">
                    Aktifkan
                  </Text>
                </Pressable>
              )}

              <Pressable
                onPress={() => {
                  setEditing(item);
                  setName(item.name);
                  setTarget(String(item.target_transaction));
                  setPercent(String(item.discount_percent));
                  setMinimum(String(item.minimum_amount));
                }}
                className="flex-1 bg-indigo-500 p-3 rounded-2xl"
              >
                <Text className="text-white text-center font-semibold">Edit</Text>
              </Pressable>

              <Pressable
                onPress={() => deletePromo(item.id)}
                className="flex-1 bg-red-500 p-3 rounded-2xl"
              >
                <Text className="text-white text-center font-semibold">Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}