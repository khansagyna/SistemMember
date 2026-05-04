import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Search } from 'lucide-react-native';
import { TransactionHeaderProps } from '@/features/types/props';

export default function TransactionHeader({
  search,
  setSearch,
  filterPaid,
  setFilterPaid,
  revenue,
  paidCount,
  unpaidCount,
  formatRupiah,
}: TransactionHeaderProps) {
  const filters = ['all', 'paid', 'unpaid'] as const;

  return (
    <View>
      {/* HEADER */}
      <View className="rounded-b-[36px] bg-white px-6 pb-6 pt-12">
        <Text className="text-3xl font-bold text-slate-900">Transaksi</Text>

        <Text className="mt-1 text-slate-500">Kelola semua transaksi customer</Text>

        {/* SEARCH */}
        <View className="mt-5 flex-row items-center rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <Search size={18} color="#64748b" />
          <TextInput
            placeholder="Cari customer..."
            value={search}
            onChangeText={setSearch}
            className="ml-3 flex-1"
          />
        </View>

        {/* FILTER */}
        <View className="mt-4 flex-row gap-3">
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilterPaid(f)}
              className={`rounded-full px-4 py-2 ${
                filterPaid === f ? 'bg-indigo-600' : 'bg-slate-200'
              }`}>
              <Text
                className={`capitalize ${
                  filterPaid === f ? 'font-semibold text-white' : 'text-slate-700'
                }`}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* STATS */}
      <View className="mt-5 px-5">
        <View className="rounded-3xl border border-slate-100 bg-white p-5">
          <View className="flex-row justify-between">
            <View>
              <Text className="text-sm text-slate-500">Revenue</Text>
              <Text className="mt-2 text-xl font-bold">Rp {formatRupiah(revenue)}</Text>
            </View>

            <View>
              <Text className="text-sm text-slate-500">Paid</Text>
              <Text className="mt-2 text-xl font-bold">{paidCount}</Text>
            </View>

            <View>
              <Text className="text-sm text-slate-500">Unpaid</Text>
              <Text className="mt-2 text-xl font-bold">{unpaidCount}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
