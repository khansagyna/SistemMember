import { View } from 'react-native'
import Skeleton from '@/shared/components/Skeleton'

export default function StatsCardSkeleton() {
  return (
    <View className="bg-white rounded-[24px] p-4 shadow-sm shadow-slate-200/50 border border-slate-50 min-h-[110px]">
      <View className="flex-row justify-between items-start mb-4">
        <Skeleton className="w-10 h-10 rounded-full" />
      </View>
      <View>
        <Skeleton className="w-20 h-3.5 rounded-md mb-2.5" />
        <Skeleton className="w-28 h-6 rounded-lg" />
      </View>
    </View>
  )
}
