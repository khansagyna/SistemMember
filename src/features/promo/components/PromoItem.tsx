import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Promo } from '../types';

interface Props {
  item: Promo;
  onDelete: (id: string) => void;
  onActivate: (id: string) => void;
}

export default function PromoItem({ item, onDelete, onActivate }: Props) {
  return (
    <View className="px-5">
      <View className="mb-3 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        <View className="flex-row justify-between">
          <View className="flex-1">
            <Text className="font-interBold text-lg text-slate-900">{item.name}</Text>
            <View className="mt-3 flex-row gap-2">
              <View className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1">
                <Text className="font-interMedium text-xs text-slate-600">
                  Trx ke-{item.target_transaction}
                </Text>
              </View>
              <View className="rounded-full border border-indigo-200 bg-indigo-100 px-3 py-1">
                <Text className="font-interMedium text-xs text-indigo-700">
                  {item.discount_percent}% OFF
                </Text>
              </View>
              {item.is_active && (
                <View className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1">
                  <Text className="font-interMedium text-xs text-emerald-700">ACTIVE</Text>
                </View>
              )}
            </View>
            <Text className="mt-3 font-inter text-slate-500">
              Minimum Rp {new Intl.NumberFormat('id-ID').format(item.minimum_amount)}
            </Text>
          </View>
          <View className="items-end">
            {!item.is_active && (
              <TouchableOpacity
                onPress={() => onActivate(item.id)}
                className="mb-4 rounded-xl bg-emerald-50 p-2">
                <Ionicons name="toggle-outline" size={24} color="#059669" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => onDelete(item.id)}
              className="rounded-xl bg-red-50 p-2">
              <Ionicons name="trash-outline" size={20} color="#dc2626" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
