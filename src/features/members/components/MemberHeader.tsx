import { View, Text, TextInput } from 'react-native'

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
    return d.getMonth() === n.getMonth()
  }).length

  const vipMembers = members.filter(
    m => (m.transaction_count || 0) >= 5
  ).length

  return (
    <View>
      <Text>Members</Text>

      <TextInput
        placeholder='Cari member...'
        value={search}
        onChangeText={setSearch}
      />

      <Text>Total: {members.length}</Text>
      <Text>Baru: {newMembersMonth}</Text>
      <Text>VIP: {vipMembers}</Text>
    </View>
  )
}