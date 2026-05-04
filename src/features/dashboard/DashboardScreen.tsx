import { useState } from 'react';
import { SafeAreaView, ScrollView, RefreshControl, View } from 'react-native';
import { useDashboard } from './hooks/useDashboard';
import DashboardHeader from './components/DashboardHeader';
import StatsGrid from './components/StatsGrid';
import QuickActions from './components/QuickActions';
import TransactionList from '../../shared/components/TransactionList';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import ConfirmModal from '@/shared/components/ConfirmModal';

export default function DashboardScreen() {
  const { transactions, members, loading, refreshing, refresh, stats } = useDashboard();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const formatRupiah = (n: number) => new Intl.NumberFormat('id-ID').format(n);

  const handleLogoutPress = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    setLoggingOut(false);
    setShowLogoutModal(false);
    router.replace('/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
        <DashboardHeader
          onLogout={handleLogoutPress}
          stats={{
            ...stats,
            trxTodayAmount: stats.omzet,
          }}
          loading={loading}
        />

        <View className="mt-4">
          {/* Stats */}
          <StatsGrid
            transactions={transactions}
            members={members}
            stats={stats}
            loading={loading}
          />

          {/* Quick Actions */}
          <View className="mt-6">
            <QuickActions
              onGoTransaction={() => router.push('/transaction')}
              onGoMember={() => router.push('/member')}
            />
          </View>

          {/* Transactions */}
          <View className="mt-6 px-6">
            <TransactionList
              transactions={transactions}
              loading={loading}
              formatRupiah={formatRupiah}
            />
          </View>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        visible={showLogoutModal}
        title="Logout"
        message="Apakah Anda yakin ingin keluar dari akun ini?"
        confirmText="Logout"
        cancelText="Batal"
        variant="warning"
        icon="log-out-outline"
        loading={loggingOut}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
      />
    </SafeAreaView>
  );
}
