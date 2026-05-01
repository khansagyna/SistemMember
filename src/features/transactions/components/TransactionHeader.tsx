import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { TransactionHeaderProps } from '@/features/types/props'


export default function TransactionHeader({
  search,
  setSearch,
  filterPaid,
  setFilterPaid,
  revenue,
  paidCount,
  unpaidCount,
  formatRupiah
}: TransactionHeaderProps) {

  return (
    <View>

      <View className='bg-white p-6 rounded-b-[36px]'>

        <Text className='text-2xl font-bold'>Transaksi</Text>

        <TextInput
          placeholder='Cari...'
          value={search}
          onChangeText={setSearch}
          className='mt-4 bg-gray-100 p-3 rounded-xl'
        />

        <View className='flex-row gap-2 mt-4'>
          {['all', 'paid', 'unpaid'].map(f => (
            <TouchableOpacity key={f} onPress={() => setFilterPaid(f as any)}>
              <Text>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </View>

      <View className='p-5'>
        <Text>Revenue: Rp {formatRupiah(revenue)}</Text>
        <Text>Paid: {paidCount}</Text>
        <Text>Unpaid: {unpaidCount}</Text>
      </View>

    </View>
  )
}