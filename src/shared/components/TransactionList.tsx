import { View, Text, ScrollView } from 'react-native'
import Skeleton from '@/shared/components/Skeleton'
import TransactionItem from '../../features/dashboard/components/TransactionItem'
import TransactionItemSkeleton from '../../features/dashboard/components/TransactionItemSkeleton'
import { TransactionListProps } from '@/features/types/props'

export default function TransactionList({
  transactions,
  loading,
  formatRupiah,
  onDelete,
  onEdit
}: TransactionListProps) {

  if (loading) {
    return (
      <View>
        <Skeleton className="w-40 h-6 rounded-md mb-4 bg-slate-200" />
        <View className='mb-28'>
          {[...Array(3)].map((_, i) => (
            <TransactionItemSkeleton key={i} />
          ))}
        </View>
      </View>
    )


  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
      <Text className='text-xl mb-4 font-interBold' >
        Daftar Transaksi
      </Text >

      <View className='mb-28'>

        {transactions?.map(item => (
          <TransactionItem
            key={item.id}
            item={item}
            formatRupiah={formatRupiah}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}

        {!transactions?.length && (
          <View className="bg-white rounded-3xl p-8 items-center justify-center border border-dashed border-slate-300">
            <Text className="text-slate-400 font-inter">
              Tidak ada transaksi
            </Text>
          </View>
        )}

      </View>

    </ScrollView >


  )
}
