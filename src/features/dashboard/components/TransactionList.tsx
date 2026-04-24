import { View, Text, ActivityIndicator } from 'react-native'
import TransactionItem from './TransactionItem'
import { TransactionListProps } from '../types/props'

export default function TransactionList({
  transactions,
  loading,
  formatRupiah
}: TransactionListProps) {

  if (loading) return <ActivityIndicator />

  return (
    <View>

      <Text className='text-xl mb-4'>
        Transaksi Terbaru
      </Text>

      <View className='mb-28'>

        {transactions.slice(0, 8).map(item => (
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