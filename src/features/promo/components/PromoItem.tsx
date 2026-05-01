import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Promo } from '../types'

interface Props {
  item: Promo
  onDelete: (id: string) => void
  onActivate: (id: string) => void
}

export default function PromoItem({ item, onDelete, onActivate }: Props) {
  return (
    <View className='px-5'>
      <View className='bg-white rounded-3xl p-5 mb-3 border border-slate-100 shadow-sm'>
        <View className='flex-row justify-between'>
          <View className='flex-1'>
            <Text className='font-interBold text-lg text-slate-900'>{item.name}</Text>
            <View className='flex-row gap-2 mt-3'>
              <View className='bg-slate-100 px-3 py-1 rounded-full border border-slate-200'>
                <Text className='text-xs font-interMedium text-slate-600'>Trx ke-{item.target_transaction}</Text>
              </View>
              <View className='bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200'>
                <Text className='text-xs text-indigo-700 font-interMedium'>{item.discount_percent}% OFF</Text>
              </View>
              {item.is_active && (
                <View className='bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200'>
                  <Text className='text-xs text-emerald-700 font-interMedium'>ACTIVE</Text>
                </View>
              )}
            </View>
            <Text className='text-slate-500 mt-3 font-inter'>
              Minimum Rp {new Intl.NumberFormat('id-ID').format(item.minimum_amount)}
            </Text>
          </View>
          <View className='items-end'>
            {!item.is_active && (
              <TouchableOpacity 
                onPress={() => onActivate(item.id)} 
                className='mb-4 p-2 bg-emerald-50 rounded-xl'
              >
                <Ionicons name='toggle-outline' size={24} color='#059669' />
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              onPress={() => onDelete(item.id)}
              className='p-2 bg-red-50 rounded-xl'
            >
              <Ionicons name='trash-outline' size={20} color='#dc2626' />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}
