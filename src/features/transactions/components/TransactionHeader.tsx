import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { Search } from 'lucide-react-native'
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

  const filters = ['all', 'paid', 'unpaid'] as const

  return (<View>

    {/* HEADER */}
    <View className='bg-white px-6 pt-12 pb-6 rounded-b-[36px]'>

      <Text className='text-3xl font-bold text-slate-900'>
        Transaksi
      </Text>

      <Text className='text-slate-500 mt-1'>
        Kelola semua transaksi customer
      </Text>

      {/* SEARCH */}
      <View className='bg-white rounded-2xl px-4 py-3 mt-5 border border-slate-200 flex-row items-center'>
        <Search size={18} color="#64748b" />
        <TextInput
          placeholder='Cari customer...'
          value={search}
          onChangeText={setSearch}
          className='ml-3 flex-1'
        />
      </View>

      {/* FILTER */}
      <View className='flex-row gap-3 mt-4'>
        {filters.map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilterPaid(f)}
            className={`px-4 py-2 rounded-full ${filterPaid === f
                ? 'bg-indigo-600'
                : 'bg-slate-200'
              }`}
          >
            <Text
              className={`capitalize ${filterPaid === f
                  ? 'text-white font-semibold'
                  : 'text-slate-700'
                }`}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

    </View>

    {/* STATS */}
    <View className='px-5 mt-5'>

      <View className='bg-white rounded-3xl p-5 border border-slate-100'>

        <View className='flex-row justify-between'>

          <View>
            <Text className='text-slate-500 text-sm'>
              Revenue
            </Text>
            <Text className='text-xl font-bold mt-2'>
              Rp {formatRupiah(revenue)}
            </Text>
          </View>

          <View>
            <Text className='text-slate-500 text-sm'>
              Paid
            </Text>
            <Text className='text-xl font-bold mt-2'>
              {paidCount}
            </Text>
          </View>

          <View>
            <Text className='text-slate-500 text-sm'>
              Unpaid
            </Text>
            <Text className='text-xl font-bold mt-2'>
              {unpaidCount}
            </Text>
          </View>

        </View>

      </View>

    </View>

  </View>


  )
}
