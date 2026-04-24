import { useEffect, useState } from 'react'
import {
    SafeAreaView,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native'

import { supabase } from '@/lib/supabase'
import { Ionicons } from '@expo/vector-icons'

export default function TransactionScreen() {

    const [transactions, setTransactions] = useState<any[]>([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [filterPaid, setFilterPaid] = useState('all')

    useEffect(() => {
        loadData()

        const channel = supabase
            .channel('trx-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'transactions' },
                () => loadData()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }

    }, [])

    const loadData = async () => {
        setLoading(true)

        const { data } = await supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false })

        setTransactions(data || [])
        setLoading(false)
    }

    const filtered = transactions.filter(t => {
        const searchMatch =
            t.name.toLowerCase().includes(search.toLowerCase())

        if (filterPaid === 'paid')
            return searchMatch && t.paid

        if (filterPaid === 'unpaid')
            return searchMatch && !t.paid

        return searchMatch
    })

    const paidCount = transactions.filter(x => x.paid).length
    const unpaidCount = transactions.filter(x => !x.paid).length

    const revenue = transactions
        .filter(x => x.paid)
        .reduce(
            (a, x) => a + ((x.amount || 0) - (x.discount || 0)), 0
        )

    const handleDelete = (id: string) => {
        Alert.alert(
            'Hapus',
            'Yakin hapus transaksi?',
            [
                { text: 'Batal' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: async () => {
                        await supabase
                            .from('transactions')
                            .delete()
                            .eq('id', id)
                    }
                }
            ]
        )
    }

    const formatRupiah = (n: number) =>
        new Intl.NumberFormat('id-ID').format(n)

    const Header = () => (
        <View>

            <View className='bg-white px-6 pt-12 pb-6 rounded-b-[36px] shadow-sm'>

                <Text className='text-3xl font-interBold text-slate-900'>
                    Transaksi
                </Text>

                <Text className='text-slate-500 font-inter mt-1'>
                    Kelola semua transaksi customer
                </Text>

                <View className='bg-white rounded-2xl px-4 py-3 mt-5 border border-slate-200 flex-row items-center'>
                    <Ionicons name='search' size={18} />
                    <TextInput
                        placeholder='Cari customer...'
                        value={search}
                        onChangeText={setSearch}
                        className='ml-3 flex-1 font-inter'
                    />
                </View>

                <View className='flex-row gap-3 mt-4'>

                    {['all', 'paid', 'unpaid'].map((f) => (
                        <TouchableOpacity
                            key={f}
                            onPress={() => setFilterPaid(f)}
                            className={`px-4 py-2 rounded-full ${filterPaid === f
                                ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                            <Text
                                className={filterPaid === f
                                    ? 'text-white font-inter' : 'text-slate-700 font-inter'}>
                                {f}
                            </Text>
                        </TouchableOpacity>
                    ))}

                </View>

            </View>

            <View className='px-5 mt-5'>

                <View className='bg-white rounded-3xl p-5 border border-slate-100 shadow-sm'>

                    <View className='flex-row justify-between'>

                        <View>
                            <Text className='text-slate-500 text-sm font-inter'>
                                Revenue
                            </Text>
                            <Text className='text-xl font-interBold mt-2'>
                                Rp {formatRupiah(revenue)}
                            </Text>
                        </View>

                        <View>
                            <Text className='text-slate-500 font-inter text-sm'>Paid</Text>
                            <Text className='text-xl font-interBold mt-2'>
                                {paidCount}
                            </Text>
                        </View>

                        <View>
                            <Text className='text-slate-500 font-inter text-sm'>Unpaid</Text>
                            <Text className='text-xl font-interBold mt-2'>
                                {unpaidCount}
                            </Text>
                        </View>

                    </View>

                </View>

                <Text className='text-xl font-interBold mt-8 mb-4'>
                    Daftar Transaksi
                </Text>

            </View>

        </View>
    )

    return (
        <SafeAreaView className='flex-1 bg-slate-100'>

            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={<Header />}
                contentContainerStyle={{ paddingBottom: 120 }}
                renderItem={({ item }) => (

                    <View className='px-5'>

                        <View className='bg-white rounded-3xl p-5 mb-3 border border-slate-100 shadow-sm'>

                            <View className='flex-row justify-between'>

                                <View className='flex-row items-center gap-3 flex-1'>

                                    <View className='w-12 h-12 rounded-full bg-indigo-100 items-center justify-center'>
                                        <Text className='font-interBold text-indigo-700'>
                                            {item.name?.slice(0, 2)?.toUpperCase()}
                                        </Text>
                                    </View>

                                    <View>
                                        <Text className='font-interBold text-base'>
                                            {item.name}
                                        </Text>

                                        <Text className='text-slate-500 font-inter text-sm'>
                                            {item.phone}
                                        </Text>

                                        <Text className='text-slate-400 font-inter text-xs mt-1'>
                                            {new Date(item.created_at).toLocaleDateString('id-ID')}
                                        </Text>

                                        {item.discount > 0 && (
                                            <View className='mt-2 bg-amber-100 px-3 py-1  rounded-full self-start'>
                                                <Text className='text-amber-700 text-xs font-interBold'>
                                                    Diskon
                                                </Text>
                                            </View>
                                        )}

                                    </View>

                                </View>

                                <View className='items-end'>

                                    <Text className='font-interBold text-lg'>
                                        Rp {formatRupiah(
                                            (item.amount || 0) - (item.discount || 0)
                                        )}
                                    </Text>

                                    <View className={`
mt-2 px-3 py-1 rounded-full
${item.paid ? 'bg-emerald-100' : 'bg-rose-100'}
`}>
                                        <Text className={item.paid ?
                                            'text-emerald-700 font-inter' : 'text-rose-700 font-inter'}>
                                            {item.paid ? 'Paid' : 'Unpaid'}
                                        </Text>
                                    </View>

                                    <View className='flex-row gap-3 mt-4'>

                                        <TouchableOpacity>
                                            <Ionicons
                                                name='pencil-outline'
                                                size={20}
                                                color='#2563eb'
                                            />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => handleDelete(item.id)}
                                        >
                                            <Ionicons
                                                name='trash-outline'
                                                size={20}
                                                color='#dc2626'
                                            />
                                        </TouchableOpacity>

                                    </View>

                                </View>

                            </View>

                        </View>

                    </View>

                )}
            />

            <TouchableOpacity
                className='absolute bottom-8 right-6 bg-indigo-600 w-16 h-16 rounded-full items-center justify-center shadow-lg'
            >
                <Ionicons name='add' size={32} color='white' />
            </TouchableOpacity>

        </SafeAreaView>
    )
}

