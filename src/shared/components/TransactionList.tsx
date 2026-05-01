import { View, Text, ActivityIndicator } from 'react-native'
import Skeleton from '@/shared/components/Skeleton'
import TransactionItem from '../../features/dashboard/components/TransactionItem'
import TransactionItemSkeleton from '../../features/dashboard/components/TransactionItemSkeleton'
import { TransactionListProps } from '../../features/dashboard/types/props'

export default function TransactionList({
  transactions,
  data,
  loading,
  formatRupiah,
  onDelete
}: TransactionListProps & { data?: any[], onDelete?: (id: string) => void }) {

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
    <View>

      <Text className='text-xl mb-4 font-interBold'>
        Transaksi Terbaru
      </Text>

      <View className='mb-28'>

        {transactions && transactions.slice(0, 8).map(item => (
          <TransactionItem
            key={item.id}
            item={item}
            formatRupiah={formatRupiah}
          />
        ))}

        {data && data.map(item => (
          <TransactionItem
            key={item.id}
            item={item}
            formatRupiah={formatRupiah}
          />
        ))}

      </View>

    </View>
  )
}