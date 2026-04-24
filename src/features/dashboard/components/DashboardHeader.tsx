import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LogOut } from 'lucide-react-native'
import { DashboardProps } from '../types/props'

export default function DashboardHeader({ onLogout }: DashboardProps) {
  return (
    <View className='px-6 pt-8 pb-6 bg-white rounded-b-[36px]'>

      <View className='flex-row justify-between items-center'>

        <View>
          <Text className='text-sm'>Selamat Datang 👋</Text>
          <Text className='text-xl font-bold'>Admin</Text>
        </View>

        <View className='flex-row gap-3'>

          <TouchableOpacity className='w-12 h-12 rounded-2xl bg-slate-100 items-center justify-center'>
            <Ionicons name='notifications-outline' size={22} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onLogout}
            className="w-12 h-12 rounded-2xl bg-indigo-600 items-center justify-center"
          >
            <LogOut size={20} color="white" />
          </TouchableOpacity>

        </View>

      </View>

    </View>
  )
}