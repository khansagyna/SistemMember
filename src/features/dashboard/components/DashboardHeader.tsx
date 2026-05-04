import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LogOut } from 'lucide-react-native';
import { DashboardProps } from '../types/props';
import { LinearGradient } from 'expo-linear-gradient';
import Skeleton from '@/shared/components/Skeleton';

const formatRupiah = (value: number) => new Intl.NumberFormat('id-ID').format(value);

export default function DashboardHeader({ onLogout, stats, loading }: DashboardProps) {
  return (
    <View className="rounded-b-[36px] bg-white px-6 pb-6 pt-12">
      {/* Top Section */}
      <View className="flex-row items-center justify-between">
        <View>
          {loading ? (
            <View>
              <Skeleton className="mb-2 h-4 w-24 rounded-md bg-slate-200" />
              <Skeleton className="h-6 w-16 rounded-md bg-slate-200" />
            </View>
          ) : (
            <>
              <Text className="font-interMedium text-sm text-gray-500">Selamat Datang 👋</Text>
              <Text className="font-interBold text-xl text-gray-900">Admin</Text>
            </>
          )}
        </View>

        <View className="flex-row items-center gap-3">
          <TouchableOpacity className="h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
            <Ionicons name="notifications-outline" size={22} color="#334155" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onLogout}
            className="h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600">
            <LogOut size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-6 overflow-hidden rounded-xl">
        <LinearGradient
          colors={['#6366f1', '#4f46e5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 18 }}
          className="rounded-xl px-4 py-6">
          {loading ? (
            <Skeleton className="h-4 w-24 rounded-md bg-indigo-400" />
          ) : (
            <Text className="font-interMedium text-sm text-indigo-100 text-white">
              Omzet Hari Ini
            </Text>
          )}

          {loading ? (
            <Skeleton className="mt-1 h-8 w-40 rounded-md bg-indigo-400" />
          ) : (
            <Text className="mt-1 font-interBold text-2xl font-bold text-white">
              Rp {formatRupiah(stats?.trxTodayAmount ?? 0)}
            </Text>
          )}
        </LinearGradient>
      </View>
    </View>
  );
}
