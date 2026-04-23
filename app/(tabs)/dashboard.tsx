
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LogOut } from 'lucide-react-native';

export default function Dashboard() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [members, setMembers] = useState(0)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)

    const { data: trx } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: mem } = await supabase
      .from('members')
      .select('*')

    setTransactions(trx || [])
    setMembers(mem?.length || 0)
    setLoading(false)
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID').format(n || 0)

  const stats = useMemo(() => {
    const today = new Date().toDateString()

    const todayTrx = transactions.filter(
      t => new Date(t.created_at).toDateString() === today
    )

    const omzet = todayTrx.reduce(
      (a, t) => a + ((t.amount || 0) - (t.discount || 0)), 0
    )

    const unpaid = transactions
      .filter(t => !t.paid)
      .reduce(
        (a, t) => a + ((t.amount || 0) - (t.discount || 0)), 0
      )

    return {
      trxToday: todayTrx.length,
      omzet,
      unpaid
    }
  }, [transactions])

  return (
    <SafeAreaView className='flex-1 bg-slate-100'>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >

        <View className='px-6 pt-8 pb-6 bg-white rounded-b-[36px] shadow-sm'>

          <View className='flex-row justify-between items-center'>
            <View>
              <Text className='font-interMedium text-sm'>Selamat Datang 👋</Text>
              <Text className='text-xl font-interBold text-slate-900'>
                Admin
              </Text>



            </View>

            <View className='flex-row gap-3'>

              <TouchableOpacity className='w-12 h-12 rounded-2xl bg-slate-100 items-center justify-center'>
                <Ionicons name='notifications-outline' size={22} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogout}
                className="w-12 h-12 rounded-2xl bg-indigo-600 items-center justify-center"
              >
                <LogOut
                  size={20}
                  color="white"
                  strokeWidth={2.5}
                />
              </TouchableOpacity>

            </View>
          </View>

          <View className='bg-indigo-600 rounded-3xl p-6 mt-6'>
            <Text className='text-indigo-100 font-interMedium'>Omzet Hari Ini</Text>

            <Text className='text-white text-3xl font-interBold mt-2'>
              Rp {formatRupiah(stats.omzet)}
            </Text>
          </View>

        </View>

        <View className='px-5 mt-5'>

          <View className='flex-row flex-wrap justify-between font-inter gap-y-4'>

            {[
              ['Total Trx', transactions.length, 'swap-horizontal', '#4f46e5'],
              ['Members', members, 'people', '#2563eb'],
              ['Piutang', `Rp ${formatRupiah(stats.unpaid)}`, 'wallet', '#ea580c'],
              ['Hari Ini', stats.trxToday, 'today', '#059669']
            ].map((item: any, i) => (
              <View
                key={i}
                className='bg-white w-[48%] p-5 rounded-3xl border border-slate-100 shadow-sm'
              >

                <View
                  className='w-12 h-12 rounded-2xl items-center justify-center mb-4'
                  style={{ backgroundColor: `${item[3]}20` }}
                >
                  <Ionicons
                    name={item[2]}
                    size={22}
                    color={item[3]}
                  />
                </View>

                <Text className='text-slate-500 text-sm font-inter'>
                  {item[0]}
                </Text>

                <Text className='text-xl font-interBold mt-1 text-slate-900'>
                  {item[1]}
                </Text>

              </View>
            ))}

          </View>

          <Text className='text-xl font-interBold mt-8 mb-4'>
            Quick Action
          </Text>

          <View className='flex-row justify-between'>

            <TouchableOpacity
              onPress={() => router.push('/transaction')}
              className='bg-indigo-600 w-[48%] p-6  pt-9 rounded-3xl'
            >
              <View className="flex  justify-center items-center">
                <Ionicons name='add' size={26} color='white' className='text-center' />
                <Text className='text-white font-interBold text-lg mt-3'>
                  Transaksi Baru
                </Text>
              </View>
            </TouchableOpacity>

            <View className='w-[48%] gap-4'>

              <TouchableOpacity
                onPress={() => router.push('/member')}
                className='bg-white p-5 rounded-3xl border border-slate-100'
              >
                <Text className='font-interBold'>Member</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className='bg-white p-5 rounded-3xl border border-slate-100'
              >
                <Text className='font-semibold'>Laporan</Text>
              </TouchableOpacity>

            </View>

          </View>

          <Text className='text-xl font-interBold mt-8 mb-4'>
            Transaksi Terbaru
          </Text>

          {loading ? (
            <ActivityIndicator size='large' />
          ) : (
            <View className='mb-28'>

              {transactions.slice(0, 8).map(item => (

                <TouchableOpacity
                  key={item.id}
                  className='bg-white rounded-3xl p-5 mb-3 border border-slate-100 shadow-sm'
                >

                  <View className='flex-row justify-between items-center'>

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
                          'text-emerald-700 font-interBold' : 'text-rose-700 font-interBold'}>
                          {item.paid ? 'Paid' : 'Piutang'}
                        </Text>
                      </View>

                    </View>

                  </View>

                </TouchableOpacity>

              ))}

            </View>
          )}

        </View>

      </ScrollView>

      <TouchableOpacity
        onPress={() => router.push('/transaction')}
        className='absolute bottom-8 right-6 bg-indigo-600 w-16 h-16 rounded-full items-center justify-center shadow-lg'
      >
        <Ionicons name='add' size={32} color='white' />
      </TouchableOpacity>

    </SafeAreaView>
  )
}

