import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LogOut } from 'lucide-react-native'
import { DashboardProps } from '../types/props'
import { LinearGradient } from 'expo-linear-gradient'
import Skeleton from '@/shared/components/Skeleton'

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID').format(value)

export default function DashboardHeader({
  onLogout,
  stats,
  loading,
}: DashboardProps) {
  return (
    <View className="px-6 pt-12 pb-6 bg-white rounded-b-[36px]">

      {/* Top Section */}
      <View className="flex-row items-center justify-between">

        <View>
          {loading ? (
            <View>
              <Skeleton className="w-24 h-4 rounded-md mb-2 bg-slate-200" />
              <Skeleton className="w-16 h-6 rounded-md bg-slate-200" />
            </View>
          ) : (
            <>
              <Text className="text-sm text-gray-500 font-interMedium">
                Selamat Datang 👋
              </Text>
              <Text className="text-xl font-interBold text-gray-900">
                Admin
              </Text>
            </>
          )}
        </View>

        <View className="flex-row items-center gap-3">

          <TouchableOpacity className="w-12 h-12 items-center justify-center rounded-2xl bg-slate-100">
            <Ionicons name="notifications-outline" size={22} color="#334155" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onLogout}
            className="w-12 h-12 items-center justify-center rounded-2xl bg-indigo-600"
          >
            <LogOut size={20} color="#fff" />
          </TouchableOpacity>

        </View>
      </View>

      <View className="mt-6 rounded-xl overflow-hidden">
        <LinearGradient
          colors={['#6366f1', '#4f46e5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 18 }}
          className="px-4 py-6 rounded-xl"
        >
          {loading ? (
            <Skeleton className="w-24 h-4 rounded-md bg-indigo-400" />
          ) : (
            <Text className="text-indigo-100 text-sm font-interMedium text-white">
              Omzet Hari Ini
            </Text>
          )}

          {loading ? (
            <Skeleton className="w-40 h-8 rounded-md mt-1 bg-indigo-400" />
          ) : (
            <Text className="text-white text-2xl font-bold mt-1 font-interBold">
              Rp {formatRupiah(stats?.trxTodayAmount ?? 0)}
            </Text>
          )}
        </LinearGradient>
      </View>

    </View>
  )
}