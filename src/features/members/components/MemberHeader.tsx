import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type MemberHeaderProps = {
  members: any[]
  search: string
  setSearch: (value: string) => void
}

export default function MemberHeader({
  members,
  search,
  setSearch
}: MemberHeaderProps) {

  const newMembersMonth = members.filter(m => {
    const d = new Date(m.created_at)
    const n = new Date()
    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear()
  }).length

  const vipMembers = members.filter(
    m => (m.transaction_count || 0) >= 5
  ).length

  return (
    <View className="px-5 pt-9 pb-4">
      <View className="mb-6">
        <Text className="text-3xl font-interBold text-slate-800">Members</Text>
        <Text className="text-slate-500 mt-1">Manage your customer loyalty</Text>
      </View>

      <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 mb-6 shadow-sm shadow-slate-200/50 border border-slate-100">
        <Ionicons name="search" size={20} color="#94a3b8" />
        <TextInput
          className="flex-1 ml-3 text-slate-800 font-medium"
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
        <View className="flex-1 bg-indigo-500 rounded-3xl p-4 shadow-sm shadow-indigo-200">
          <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center mb-2">
            <Ionicons name="people" size={16} color="white" />
          </View>
          <Text className="text-indigo-100 text-xs font-medium mb-1">Total</Text>
          <Text className="text-white text-2xl font-bold">{members.length}</Text>
        </View>

        <View className="flex-1 bg-emerald-500 rounded-3xl p-4 shadow-sm shadow-emerald-200">
          <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center mb-2">
            <Ionicons name="person-add" size={16} color="white" />
          </View>
          <Text className="text-emerald-100 text-xs font-medium mb-1">New</Text>
          <Text className="text-white text-2xl font-bold">{newMembersMonth}</Text>
        </View>

        <View className="flex-1 bg-amber-500 rounded-3xl p-4 shadow-sm shadow-amber-200">
          <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center mb-2">
            <Ionicons name="star" size={16} color="white" />
          </View>
          <Text className="text-amber-100 text-xs font-medium mb-1">VIP</Text>
          <Text className="text-white text-2xl font-bold">{vipMembers}</Text>
        </View>
      </View>
      
      <View className="mt-8 mb-2">
        <Text className="text-lg font-bold text-slate-800">Directory</Text>
      </View>
    </View>
  )
}