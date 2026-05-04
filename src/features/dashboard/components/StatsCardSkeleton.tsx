import { View } from 'react-native';
import Skeleton from '@/shared/components/Skeleton';

export default function StatsCardSkeleton() {
  return (
    <View className="min-h-[110px] rounded-[24px] border border-slate-50 bg-white p-4 shadow-sm shadow-slate-200/50">
      <View className="mb-4 flex-row items-start justify-between">
        <Skeleton className="h-10 w-10 rounded-full" />
      </View>
      <View>
        <Skeleton className="mb-2.5 h-3.5 w-20 rounded-md" />
        <Skeleton className="h-6 w-28 rounded-lg" />
      </View>
    </View>
  );
}
