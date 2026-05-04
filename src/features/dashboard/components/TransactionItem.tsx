import { View, Text, TouchableOpacity } from 'react-native';
import { TransactionItemProps } from '@/features/types/props';
import { Ionicons } from '@expo/vector-icons';

export default function TransactionItem({
  item,
  formatRupiah,
  onDelete,
  onEdit,
}: TransactionItemProps) {
  return (
    <TouchableOpacity
      className="mb-3 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
      onPress={() => onEdit?.(item)}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
            <Text className="font-interBold text-indigo-700">
              {item.name?.slice(0, 2)?.toUpperCase()}
            </Text>
          </View>

          <View>
            <Text className="font-interBold text-base text-slate-800">{item.name}</Text>
            <Text className="font-inter text-sm text-slate-500">{item.phone}</Text>
            <Text className="mt-1 font-inter text-xs text-slate-400">
              {new Date(item.created_at).toLocaleDateString('id-ID')}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="font-interBold text-lg">
            Rp {formatRupiah((item.amount || 0) - (item.discount || 0))}
          </Text>

          <View
            className={`mt-2 rounded-full px-3 py-1 ${
              item.paid ? 'bg-emerald-100' : 'bg-rose-100'
            }`}>
            <Text
              className={`text-xs font-semibold ${item.paid ? 'text-emerald-700' : 'text-rose-700'}`}>
              {item.paid ? 'Paid' : 'Unpaid'}
            </Text>
          </View>

          {(onEdit || onDelete) && (
            <View className="mt-3 flex-row gap-3">
              {onEdit && (
                <TouchableOpacity onPress={() => onEdit(item)}>
                  <Ionicons name="pencil-outline" size={18} color="#2563eb" />
                </TouchableOpacity>
              )}
              {onDelete && (
                <TouchableOpacity onPress={() => onDelete(item.id)}>
                  <Ionicons name="trash-outline" size={18} color="#dc2626" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
