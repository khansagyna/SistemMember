import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AddMemberModal from "@/app/member/AddMemberModal";
import EditMemberModal from "@/app/member/EditMemberModal";
import { supabase } from "@/utils/supabase";
import { Member } from "@/app/member/types";

export default function MemberPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Member | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      Alert.alert("Error", error.message);
    } else if (data) {
      setMembers(data);
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Hapus Member?", "Data tidak bisa dikembalikan", [
      { text: "Batal" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          await supabase.from("members").delete().eq("id", id);
          fetchMembers();
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-slate-100 pt-16 px-5">

      {/* Header */}
      <View className="mb-6">
        <Text className="text-3xl font-bold text-slate-800">
          Members
        </Text>
        <Text className="text-slate-500 mt-1">
          Total {members.length} member
        </Text>
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator size="large" color="#213448" />
      ) : members.length === 0 ? (
        <View className="flex-1 items-center justify-center mt-20">
          <Ionicons name="people-outline" size={60} color="#cbd5e1" />
          <Text className="text-slate-400 mt-3">
            Belum ada member
          </Text>
        </View>
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View className="bg-white p-6 rounded-3xl mb-4 shadow-sm border border-slate-100">

              <Text className="text-lg font-semibold text-slate-800">
                {item.name}
              </Text>

              <Text className="text-slate-500 mt-1">
                {item.phone}
              </Text>

              <View className="flex-row mt-5 space-x-3">
                <TouchableOpacity
                  onPress={() => setSelected(item)}
                  className="flex-1 bg-[#213448] py-3 mr-3 rounded-xl items-center"
                >
                  <Text className="text-white font-semibold">
                    Edit
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  className="flex-1 bg-red-500 py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-semibold">
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => setShowAdd(true)}
        className="absolute bottom-12 right-5 w-16 h-16 bg-[#213448] rounded-full items-center justify-center shadow-lg"
      >
        <Text className="text-white text-3xl font-bold">+</Text>
      </TouchableOpacity>

      {showAdd && (
        <AddMemberModal
          onClose={() => {
            setShowAdd(false);
            fetchMembers();
          }}
        />
      )}

      {selected && (
        <EditMemberModal
          data={selected}
          onClose={() => {
            setSelected(null);
            fetchMembers();
          }}
        />
      )}
    </View>
  );
}