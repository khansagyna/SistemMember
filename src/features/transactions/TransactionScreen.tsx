import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { useTransactions } from 'app/hooks/useTransaction';
import { transactionApi } from './api/transaction.api';
import TransactionHeader from './components/TransactionHeader';
import TransactionList from '@/shared/components/TransactionList';
import AddTransactionModal from './components/AddTransactionModal';
import EditTransactionModal from './components/EditTransactionModal';
import { useState } from 'react';
import { Plus } from 'lucide-react-native';
import { useToast } from '@/shared/hooks/useToast';
import Toast from '@/shared/components/Toast';
import ConfirmModal from '@/shared/components/ConfirmModal';

export default function TransactionScreen() {
  const {
    filtered,
    search,
    setSearch,
    filterPaid,
    setFilterPaid,
    revenue,
    paidCount,
    unpaidCount,
    loading,
    loadData,
  } = useTransactions();

  const { toast, showToast, hideToast } = useToast();

  const [showAdd, setShowAdd] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const formatRupiah = (n: number) => new Intl.NumberFormat('id-ID').format(n);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await transactionApi.remove(deleteId);
      loadData();
      showToast('success', 'Transaksi berhasil dihapus');
    } catch (e) {
      showToast('error', 'Gagal menghapus transaksi');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TransactionHeader
          search={search}
          setSearch={setSearch}
          filterPaid={filterPaid}
          setFilterPaid={setFilterPaid}
          revenue={revenue}
          paidCount={paidCount}
          unpaidCount={unpaidCount}
          formatRupiah={formatRupiah}
        />
        <View className="mt-3 flex-1 px-4">
          <TransactionList
            transactions={filtered}
            loading={loading}
            formatRupiah={formatRupiah}
            onDelete={setDeleteId}
            onEdit={(item) => {
              setEditItem(item);
              setShowEditModal(true);
            }}
          />
        </View>
      </SafeAreaView>

      <TouchableOpacity
        onPress={() => setShowAdd(true)}
        className="elevation-5 absolute bottom-[110px] right-5 h-14 w-14 items-center justify-center rounded-full bg-indigo-600 shadow-lg"
        style={{ zIndex: 9999 }}>
        <Plus size={28} color="white" />
      </TouchableOpacity>

      <AddTransactionModal
        visible={showAdd}
        onClose={(added) => {
          setShowAdd(false);
          if (added) loadData();
        }}
      />

      <EditTransactionModal
        visible={showEditModal}
        data={editItem}
        onClose={(updated) => {
          setShowEditModal(false);
          setEditItem(null);
          if (updated) loadData();
        }}
      />

      <ConfirmModal
        visible={!!deleteId}
        title="Hapus Transaksi"
        message="Yakin ingin menghapus data transaksi ini?"
        confirmText="Hapus"
        variant="danger"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      <Toast visible={toast.visible} type={toast.type} message={toast.message} onHide={hideToast} />
    </View>
  );
}
