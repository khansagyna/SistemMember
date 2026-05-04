import { View, Text, ScrollView } from 'react-native';
import Skeleton from '@/shared/components/Skeleton';
import TransactionItem from '../../features/dashboard/components/TransactionItem';
import TransactionItemSkeleton from '../../features/dashboard/components/TransactionItemSkeleton';
import { TransactionListProps } from '@/features/types/props';

export default function TransactionList({
  transactions,
  loading,
  formatRupiah,
  onDelete,
  onEdit,
}: TransactionListProps) {
  if (loading) {
    return (
      <View>
        <Skeleton className="mb-4 h-6 w-40 rounded-md bg-slate-200" />
        <View className="mb-28">
          {[...Array(3)].map((_, i) => (
            <TransactionItemSkeleton key={i} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
      <Text className="mb-4 font-interBold text-xl">Daftar Transaksi</Text>

      <View className="mb-28">
        {transactions?.map((item) => (
          <TransactionItem
            key={item.id}
            item={item}
            formatRupiah={formatRupiah}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}

        {!transactions?.length && (
          <View className="items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8">
            <Text className="font-inter text-slate-400">Tidak ada transaksi</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
