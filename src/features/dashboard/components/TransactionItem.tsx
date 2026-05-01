import { View, Text, TouchableOpacity } from 'react-native'
import { TransactionItemProps } from '../types/props'

export default function TransactionItem({ item, formatRupiah }: TransactionItemProps) {

  return (
    <TouchableOpacity className='bg-white rounded-3xl p-5 mb-3'>

      <View className='flex-row justify-between items-center'>

        <View className='flex-row gap-3 flex-1'>

          <View className='w-12 h-12 rounded-full bg-indigo-100 items-center justify-center'>
            <Text className='font-interMedium'>
              {item.name?.slice(0, 2)?.toUpperCase()}
            </Text>
          </View>

          <View>
            <Text className='font-inter'>{item.name}</Text>
            <Text className='font-inter'>{item.phone}</Text>
          </View>

        </View>

        <View className='items-end'>

          <Text className='font-interBold text-lg'>
            Rp {formatRupiah(
              (item.amount || 0) - (item.discount || 0)
            )}
          </Text>
          <Text
            className={`px-3 py-1 rounded-full text-xs font-semibold ${item.paid
                ? 'bg-green-100 text-green-700'
                : 'bg-orange-100 text-orange-700'
              }`}
          >
            {item.paid ? 'Paid' : 'Piutang'}
          </Text>

        </View>

      </View>

    </TouchableOpacity>
  )
}