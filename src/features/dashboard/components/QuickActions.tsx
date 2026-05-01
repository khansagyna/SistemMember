import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { QuickActionProps } from '../types/props'

export default function QuickActions({
  onGoTransaction,
  onGoMember,
}: QuickActionProps) {
  return (
    <View className="flex-row px-6 ">

      {/* LEFT */}
      <View style={{ width: '48%' }}>
        <TouchableOpacity
          onPress={onGoTransaction}
          className="bg-indigo-600 p-6 rounded-3xl justify-center items-center"
          style={{ flex: 1 }}
          activeOpacity={0.8}
        >
          <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center">
            <Ionicons name="add" size={26} color="white" />
          </View>

          <Text className="text-white mt-3 font-interBold">
            Transaksi Baru
          </Text>
        </TouchableOpacity>
      </View>

      {/* RIGHT */}
      <View style={{ width: '48%', marginLeft: '4%' }}>

        <TouchableOpacity
          onPress={onGoMember}
          className="bg-white p-5  rounded-3xl flex-row items-center"
          style={{
            elevation: 2,
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 6,
          }}
          activeOpacity={0.8}
        >
          <View className="w-10 h-10 rounded-xl bg-blue-100 items-center justify-center mr-3">
            <Ionicons name="people" size={20} color="#2563eb" />
          </View>

          <Text className="font-interMedium text-gray-800">
            Member
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white p-5 rounded-3xl flex-row items-center mt-4"
          style={{
            elevation: 2,
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 6,
          }}
          activeOpacity={0.8}
        >
          <View className="w-10 h-10 rounded-xl bg-green-100 items-center justify-center mr-3">
            <Ionicons name="document-text" size={20} color="#059669" />
          </View>

          <Text className="font-interMedium text-gray-800">
            Laporan
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  )
}