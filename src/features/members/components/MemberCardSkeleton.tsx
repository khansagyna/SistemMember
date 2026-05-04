import { View } from 'react-native';
import Skeleton from '@/shared/components/Skeleton';

export default function MemberCardSkeleton() {
  return (
    <View className="mb-3 px-5">
      <View className="flex-row items-center justify-between rounded-3xl border border-slate-50 bg-white p-4 shadow-sm shadow-slate-200/50">
        <View className="flex-1 flex-row items-center">
          <Skeleton className="mr-4 h-14 w-14 rounded-full" />

          <View className="flex-1 justify-center">
            <Skeleton className="mb-2 h-5 w-3/4 rounded-md" />
            <Skeleton className="mb-2 h-4 w-1/2 rounded-md" />
            <Skeleton className="h-4 w-12 rounded-full" />
          </View>
        </View>

        <View className="ml-2 flex-row gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </View>
      </View>
    </View>
  );
}
