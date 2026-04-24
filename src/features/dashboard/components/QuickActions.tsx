import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { QuickActionProps } from '../types/props'

export default function QuickActions({ onGoTransaction, onGoMember }: QuickActionProps) {

  return (
    <View className='flex-row justify-between'>

      <TouchableOpacity
        onPress={onGoTransaction}
        className='bg-indigo-600 w-[48%] p-6 rounded-3xl'
      >
        <View className="items-center">
          <Ionicons name='add' size={26} color='white' />
          <Text className='text-white mt-3'>Transaksi Baru</Text>
        </View>
      </TouchableOpacity>

      <View className='w-[48%] gap-4'>

        <TouchableOpacity
          onPress={onGoMember}
          className='bg-white p-5 rounded-3xl'
        >
          <Text>Member</Text>
        </TouchableOpacity>

        <TouchableOpacity className='bg-white p-5 rounded-3xl'>
          <Text>Laporan</Text>
        </TouchableOpacity>

      </View>

    </View>
  )
}