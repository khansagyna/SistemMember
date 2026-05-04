import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type MemberHeaderProps = {
  members: any[];
  search: string;
  setSearch: (value: string) => void;
};

export default function MemberHeader({ members, search, setSearch }: MemberHeaderProps) {
  const newMembersMonth = members.filter((m) => {
    const d = new Date(m.created_at);
    const n = new Date();
    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
  }).length;

  const vipMembers = members.filter((m) => (m.transaction_count || 0) >= 5).length;

  return (
    <View className="px-5 pb-4 pt-9">
      <View className="mb-6">
        <Text className="font-interBold text-3xl text-slate-800">Members</Text>
        <Text className="mt-1 text-slate-500">Manage your customer loyalty</Text>
      </View>

      <View className="mb-6 flex-row items-center rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm shadow-slate-200/50">
        <Ionicons name="search" size={20} color="#94a3b8" />
        <TextInput
          className="ml-3 flex-1 font-medium text-slate-800"
          placeholder="Search members..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1 rounded-3xl bg-indigo-500 p-4 shadow-sm shadow-indigo-200">
          <View className="mb-2 h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Ionicons name="people" size={16} color="white" />
          </View>
          <Text className="mb-1 text-xs font-medium text-indigo-100">Total</Text>
          <Text className="text-2xl font-bold text-white">{members.length}</Text>
        </View>

        <View className="flex-1 rounded-3xl bg-emerald-500 p-4 shadow-sm shadow-emerald-200">
          <View className="mb-2 h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Ionicons name="person-add" size={16} color="white" />
          </View>
          <Text className="mb-1 text-xs font-medium text-emerald-100">New</Text>
          <Text className="text-2xl font-bold text-white">{newMembersMonth}</Text>
        </View>

        <View className="flex-1 rounded-3xl bg-amber-500 p-4 shadow-sm shadow-amber-200">
          <View className="mb-2 h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Ionicons name="star" size={16} color="white" />
          </View>
          <Text className="mb-1 text-xs font-medium text-amber-100">VIP</Text>
          <Text className="text-2xl font-bold text-white">{vipMembers}</Text>
        </View>
      </View>

      <View className="mb-2 mt-8">
        <Text className="text-lg font-bold text-slate-800">Directory</Text>
      </View>
    </View>
  );
}
