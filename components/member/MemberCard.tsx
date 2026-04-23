import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function MemberCard({ item, onDelete }) {
  return (
    <View className='px-5'>
      <View className='bg-white rounded-3xl p-5 mb-3'>

        <View className='flex-row justify-between'>

          <View className='flex-row gap-3 flex-1'>

            <View className='w-12 h-12 rounded-full bg-indigo-100 items-center justify-center'>
              <Text>
                {item.name?.slice(0, 2)?.toUpperCase()}
              </Text>
            </View>

            <View>
              <Text>{item.name}</Text>
              <Text>{item.phone}</Text>
            </View>

          </View>

          <TouchableOpacity onPress={() => onDelete(item.id)}>
            <Ionicons name='trash-outline' size={20} />
          </TouchableOpacity>

        </View>

      </View>
    </View>
  )
}