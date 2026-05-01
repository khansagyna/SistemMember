import { View } from 'react-native'
import Skeleton from '@/shared/components/Skeleton'

export default function MemberCardSkeleton() {
  return (
    <View className="px-5 mb-3">
      <View className="bg-white rounded-3xl p-4 shadow-sm shadow-slate-200/50 border border-slate-50 flex-row items-center justify-between">
        
        <View className="flex-row items-center flex-1">
          <Skeleton className="w-14 h-14 rounded-full mr-4" />

          <View className="flex-1 justify-center">
            <Skeleton className="w-3/4 h-5 rounded-md mb-2" />
            <Skeleton className="w-1/2 h-4 rounded-md mb-2" />
            <Skeleton className="w-12 h-4 rounded-full" />
          </View>
        </View>

        <View className="flex-row gap-2 ml-2">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </View>

      </View>
    </View>
  )
}
