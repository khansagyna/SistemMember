import { useState } from 'react'
import { SafeAreaView, FlatList, ActivityIndicator, Alert } from 'react-native'

import { useMembers } from '../hooks/useMember'
import { deleteMember } from '../api/member/promoApi'
import MemberCard from '@/components/member/MemberCard'
import MemberHeader from '@/components/member/MemberHeader'

export default function MemberPage() {
  const { members, loading } = useMembers()
  const [search, setSearch] = useState('')

  const handleDelete = (id: string) => {
    Alert.alert('Hapus Member', 'Yakin?', [
      { text: 'Batal' },
      {
        text: 'Hapus',
        onPress: () => deleteMember(id)
      }
    ])
  }

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <ActivityIndicator />

  return (
    <SafeAreaView className='flex-1'>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <MemberHeader
            members={members}
            search={search}
            setSearch={setSearch}
          />
        }
        renderItem={({ item }) => (
          <MemberCard
            item={item}
            onDelete={handleDelete}
          />
        )}
      />

    </SafeAreaView>
  )
}