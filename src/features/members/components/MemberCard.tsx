import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type MemberCardProps = {
  item: any;
  onDelete: (id: string) => void;
  onEdit: (item: any) => void;
};

export default function MemberCard({ item, onDelete, onEdit }: MemberCardProps) {
  return (
    <View className="mb-3 px-5">
      <View className="flex-row items-center justify-between rounded-3xl border border-slate-50 bg-white p-4 shadow-sm shadow-slate-200/50">
        <View className="flex-1 flex-row items-center">
          <View className="mr-4 h-14 w-14 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50">
            <Text className="text-lg font-bold text-indigo-600">
              {item.name?.slice(0, 2)?.toUpperCase()}
            </Text>
          </View>

          <View className="flex-1">
            <Text className="mb-1 text-base font-bold text-slate-800" numberOfLines={1}>
              {item.name}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="call-outline" size={12} color="#64748b" />
              <Text className="ml-1 text-sm text-slate-500" numberOfLines={1}>
                {item.phone}
              </Text>
            </View>
            {(item.transaction_count || 0) >= 5 && (
              <View className="mt-1.5 flex-row items-center self-start rounded-full bg-amber-100 px-2 py-0.5">
                <Ionicons name="star" size={10} color="#d97706" />
                <Text className="ml-1 text-[10px] font-bold text-amber-700">VIP</Text>
              </View>
            )}
          </View>
        </View>

        <View className="ml-2 flex-row items-center gap-2">
          <TouchableOpacity
            onPress={() => onEdit(item)}
            className="h-10 w-10 items-center justify-center rounded-full bg-indigo-50">
            <Ionicons name="pencil-outline" size={18} color="#6366f1" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onDelete(item.id)}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-50">
            <Ionicons name="trash-outline" size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
