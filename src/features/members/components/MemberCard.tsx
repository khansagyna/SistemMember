import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type MemberCardProps = {
  item: any
  onDelete: (id: string) => void
  onEdit: (item: any) => void
}

export default function MemberCard({ item, onDelete, onEdit }: MemberCardProps) {
  return (
    <View className="px-5 mb-3">
      <View className="bg-white rounded-3xl p-4 shadow-sm shadow-slate-200/50 border border-slate-50 flex-row items-center justify-between">
        
        <View className="flex-row items-center flex-1">
          <View className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-100 items-center justify-center mr-4">
            <Text className="text-indigo-600 font-bold text-lg">
              {item.name?.slice(0, 2)?.toUpperCase()}
            </Text>
          </View>

          <View className="flex-1">
            <Text className="text-slate-800 font-bold text-base mb-1" numberOfLines={1}>
              {item.name}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="call-outline" size={12} color="#64748b" />
              <Text className="text-slate-500 text-sm ml-1" numberOfLines={1}>
                {item.phone}
              </Text>
            </View>
            {(item.transaction_count || 0) >= 5 && (
               <View className="bg-amber-100 self-start px-2 py-0.5 rounded-full mt-1.5 flex-row items-center">
                 <Ionicons name="star" size={10} color="#d97706" />
                 <Text className="text-amber-700 text-[10px] font-bold ml-1">VIP</Text>
               </View>
            )}
          </View>
        </View>

        <View className="flex-row items-center gap-2 ml-2">
          <TouchableOpacity 
            onPress={() => onEdit(item)}
            className="w-10 h-10 rounded-full bg-indigo-50 items-center justify-center"
          >
            <Ionicons name="pencil-outline" size={18} color="#6366f1" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => onDelete(item.id)}
            className="w-10 h-10 rounded-full bg-red-50 items-center justify-center"
          >
            <Ionicons name="trash-outline" size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  )
}