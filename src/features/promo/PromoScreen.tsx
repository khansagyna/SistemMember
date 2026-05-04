import { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePromo } from './hooks/usePromo';
import { promoApi } from './api/promo.api';
import PromoItem from './components/PromoItem';
import ConfirmModal from '@/shared/components/ConfirmModal';
import Toast from '@/shared/components/Toast';
import { useToast } from '@/shared/hooks/useToast';
import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';

export default function PromoScreen() {
  const { promos, stats, loading, reload } = usePromo();
  const { toast, showToast, hideToast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [discount, setDiscount] = useState('');
  const [minimum, setMinimum] = useState('');

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activateId, setActivateId] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleAddPress = () => {
    if (!name || !target || !discount || !minimum) {
      showToast('error', 'Lengkapi semua data');
      return;
    }
    setShowSaveModal(true);
  };

  const handleAddConfirm = async () => {
    setActionLoading(true);
    try {
      await promoApi.create({
        name,
        target_transaction: Number(target),
        discount_percent: Number(discount),
        minimum_amount: Number(minimum),
        is_active: false,
      });
      setName('');
      setTarget('');
      setDiscount('');
      setMinimum('');
      setShowForm(false);
      setShowSaveModal(false);
      showToast('success', 'Promo berhasil ditambahkan');
    } catch (e) {
      showToast('error', 'Gagal menambahkan promo');
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivateConfirm = async () => {
    if (!activateId) return;
    setActionLoading(true);
    try {
      await promoApi.activate(activateId);
      showToast('success', 'Promo berhasil diaktifkan');
    } catch (e) {
      showToast('error', 'Gagal mengaktifkan promo');
    } finally {
      setActionLoading(false);
      setActivateId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      await promoApi.remove(deleteId);
      showToast('success', 'Promo berhasil dihapus');
    } catch (e) {
      showToast('error', 'Gagal menghapus promo');
    } finally {
      setActionLoading(false);
      setDeleteId(null);
    }
  };

  const Header = () => (
    <View>
      <View className="rounded-b-[36px] bg-white px-6 pb-6 pt-12 shadow-sm">
        <Text className="font-interBold text-3xl text-slate-900">Promo</Text>
        <Text className="mt-2 font-inter text-slate-500">Kelola rule promo loyalitas</Text>
      </View>
      <View className="mt-5 px-5">
        <View className="flex-row justify-between rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <View className="items-center">
            <Text className="font-inter text-xs uppercase tracking-widest text-slate-500">
              Active
            </Text>
            <Text className="mt-1 font-interBold text-xl text-emerald-600">
              {stats.activeCount}
            </Text>
          </View>
          <View className="items-center">
            <Text className="font-inter text-xs uppercase tracking-widest text-slate-500">
              Total
            </Text>
            <Text className="mt-1 font-interBold text-xl text-slate-900">{stats.totalRules}</Text>
          </View>
          <View className="items-center">
            <Text className="font-inter text-xs uppercase tracking-widest text-slate-500">
              Max Off
            </Text>
            <Text className="mt-1 font-interBold text-xl text-indigo-600">
              {stats.maxDiscount}%
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setShowForm(!showForm)}
          className="mt-6 flex-row items-center justify-center rounded-2xl bg-indigo-600 p-4 shadow-md shadow-indigo-200">
          <Ionicons name={showForm ? 'close' : 'add'} size={20} color="white" />
          <Text className="ml-2 font-interBold text-white">
            {showForm ? 'Tutup Form' : 'Tambah Promo Baru'}
          </Text>
        </TouchableOpacity>

        {showForm && (
          <View className="mt-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <Input
              label="Nama Promo"
              placeholder="Contoh: Promo Weekend"
              value={name}
              onChangeText={setName}
              icon="pricetag-outline"
            />
            <Input
              label="Target Transaksi"
              placeholder="Contoh: 10 (Transaksi ke-10 diskon)"
              value={target}
              onChangeText={setTarget}
              icon="analytics-outline"
              keyboardType="number-pad"
            />
            <Input
              label="Persen Diskon"
              placeholder="Contoh: 20"
              value={discount}
              onChangeText={setDiscount}
              icon="gift-outline"
              keyboardType="number-pad"
            />
            <Input
              label="Minimum Belanja"
              placeholder="Contoh: 50000"
              value={minimum}
              onChangeText={setMinimum}
              icon="cash-outline"
              keyboardType="number-pad"
            />

            <View className="mt-4">
              <Button title="Simpan Promo" onPress={handleAddPress} size="lg" />
            </View>
          </View>
        )}
        <Text className="mb-4 ml-1 mt-8 font-interBold text-xl">Daftar Promo</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <FlatList
        data={promos}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Header />}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <PromoItem item={item} onDelete={setDeleteId} onActivate={setActivateId} />
        )}
      />

      <ConfirmModal
        visible={!!deleteId}
        title="Hapus Promo"
        message="Yakin ingin menghapus promo ini?"
        confirmText="Hapus"
        variant="danger"
        loading={actionLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      <ConfirmModal
        visible={!!activateId}
        title="Aktifkan Promo"
        message="Promo lain akan dinonaktifkan. Lanjutkan?"
        confirmText="Aktifkan"
        variant="info"
        loading={actionLoading}
        onConfirm={handleActivateConfirm}
        onCancel={() => setActivateId(null)}
      />

      <ConfirmModal
        visible={showSaveModal}
        title="Simpan Promo"
        message="Apakah data promo sudah benar?"
        confirmText="Simpan"
        loading={actionLoading}
        onConfirm={handleAddConfirm}
        onCancel={() => setShowSaveModal(false)}
      />

      <Toast visible={toast.visible} type={toast.type} message={toast.message} onHide={hideToast} />
    </SafeAreaView>
  );
}
