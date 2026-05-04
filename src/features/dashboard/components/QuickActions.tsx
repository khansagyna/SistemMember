import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QuickActionProps } from '../types/props';

export default function QuickActions({ onGoTransaction, onGoMember }: QuickActionProps) {
  return (
    <View className="flex-row px-6 ">
      {/* LEFT */}
      <View style={{ width: '48%' }}>
        <TouchableOpacity
          onPress={onGoTransaction}
          className="items-center justify-center rounded-3xl bg-indigo-600 p-6"
          style={{ flex: 1 }}
          activeOpacity={0.8}>
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
            <Ionicons name="add" size={26} color="white" />
          </View>

          <Text className="mt-3 font-interBold text-white">Transaksi Baru</Text>
        </TouchableOpacity>
      </View>

      {/* RIGHT */}
      <View style={{ width: '48%', marginLeft: '4%' }}>
        <TouchableOpacity
          onPress={onGoMember}
          className="flex-row items-center  rounded-3xl bg-white p-5"
          style={{
            elevation: 2,
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 6,
          }}
          activeOpacity={0.8}>
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
            <Ionicons name="people" size={20} color="#2563eb" />
          </View>

          <Text className="font-interMedium text-gray-800">Member</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4 flex-row items-center rounded-3xl bg-white p-5"
          style={{
            elevation: 2,
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 6,
          }}
          activeOpacity={0.8}>
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-green-100">
            <Ionicons name="document-text" size={20} color="#059669" />
          </View>

          <Text className="font-interMedium text-gray-800">Laporan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
