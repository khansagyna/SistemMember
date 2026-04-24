import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { StatsCardProps } from '../types/props'

export default function StatsCard({ title, value, icon, color }: StatsCardProps) {
  return (
    <View className='bg-white w-[48%] p-5 rounded-3xl'>
      <Ionicons name={icon} size={22} color={color} />
      <Text>{title}</Text>
      <Text>{value}</Text>
    </View>
  )
}