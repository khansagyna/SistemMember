import { View } from 'react-native';
import Skeleton from '@/shared/components/Skeleton';

export default function TransactionItemSkeleton() {
  return (
    <View className="mb-3 rounded-3xl bg-white p-5">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <View className="flex-1">
            <Skeleton className="h-4.5 mb-2.5 w-1/2 rounded-md" />
            <Skeleton className="h-3.5 w-1/3 rounded-md" />
          </View>
        </View>

        <View className="items-end">
          <Skeleton className="mb-2.5 h-5 w-20 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </View>
      </View>
    </View>
  );
}
