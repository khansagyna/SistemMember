import { SafeAreaView, ScrollView, RefreshControl } from 'react-native'
import { useDashboard } from './hooks/useDashboard'
import DashboardHeader from './components/DashboardHeader'
import StatsGrid from './components/StatsGrid'
import QuickActions from './components/QuickActions'
import TransactionList from './components/TransactionList'
import { router } from 'expo-router'
import { supabase } from '@/lib/supabase'

export default function DashboardScreen() {

  const {
    transactions,
    members,
    loading,
    refreshing,
    refresh,
    stats
  } = useDashboard()

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID').format(n)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <SafeAreaView className='flex-1 bg-slate-100'>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >

        <DashboardHeader onLogout={handleLogout} />

        <StatsGrid
          transactions={transactions}
          members={members}
          stats={stats}
        />

        <QuickActions
          onGoTransaction={() => router.push('/transaction')}
          onGoMember={() => router.push('/member')}
        />

        <TransactionList
          transactions={transactions}
          loading={loading}
          formatRupiah={formatRupiah}
        />

      </ScrollView>

    </SafeAreaView>
  )
}