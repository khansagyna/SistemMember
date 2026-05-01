import { View } from 'react-native'
import Skeleton from '@/shared/components/Skeleton'

export default function TransactionItemSkeleton() {
  return (
    <View className='bg-white rounded-3xl p-5 mb-3'>
      <View className='flex-row justify-between items-center'>
        
        <View className='flex-row gap-3 flex-1 items-center'>
          <Skeleton className='w-12 h-12 rounded-full' />
          <View className='flex-1'>
            <Skeleton className='w-1/2 h-4.5 rounded-md mb-2.5' />
            <Skeleton className='w-1/3 h-3.5 rounded-md' />
          </View>
        </View>

        <View className='items-end'>
          <Skeleton className='w-20 h-5 rounded-md mb-2.5' />
          <Skeleton className='w-16 h-5 rounded-full' />
        </View>

      </View>
    </View>
  )
}
