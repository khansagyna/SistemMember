import { useState } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { useMembers } from '@/features/members/hooks/useMembers';
import { memberApi } from '@/features/members/api/member.api';
import MemberCard from '@/features/members/components/MemberCard';
import MemberCardSkeleton from '@/features/members/components/MemberCardSkeleton';
import MemberHeader from '@/features/members/components/MemberHeader';
import ConfirmModal from '@/shared/components/ConfirmModal';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '@/shared/components/Input';
import Button from '@/shared/components/Button';
import { Member } from '@/features/members/types';
import Toast from '@/shared/components/Toast';
import { useToast } from '@/shared/hooks/useToast';
import AddMemberModal from './components/AddMemberModal';
import EditMemberModal from './components/EditMemberModal';

export default function MemberScreen() {
  const { members, loading, reload } = useMembers();
  const [search, setSearch] = useState('');
  const { toast, showToast, hideToast } = useToast();

  // Add Member state
  const [showAddModal, setShowAddModal] = useState(false);

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Edit state
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const handleDeletePress = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await memberApi.remove(deleteId);
      reload();
      showToast('success', 'Member berhasil dihapus');
    } catch (e) {
      showToast('error', 'Gagal menghapus member');
    }
    setDeleting(false);
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleEditPress = (item: Member) => {
    setEditingMember(item);
  };

  const filtered = members.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <MemberHeader members={[]} search={search} setSearch={setSearch} />
        {[...Array(5)].map((_, i) => (
          <MemberCardSkeleton key={i} />
        ))}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <MemberHeader members={members} search={search} setSearch={setSearch} />
        }
        ListEmptyComponent={
          <View className="items-center justify-center px-5 py-10">
            <Text className="text-center text-base text-slate-400">
              {search
                ? 'Tidak ada member yang sesuai dengan pencarian.'
                : 'Belum ada member yang ditambahkan.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <MemberCard item={item} onDelete={handleDeletePress} onEdit={handleEditPress} />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        visible={showDeleteModal}
        title="Hapus Member"
        message="Apakah Anda yakin ingin menghapus member ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        variant="danger"
        icon="trash-outline"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeleteId(null);
        }}
      />

      {/* Edit Member Modal */}
      <EditMemberModal
        visible={!!editingMember}
        member={editingMember}
        onClose={(updated) => {
          setEditingMember(null);
          if (updated) reload();
        }}
      />

      {/* Toast */}
      <Toast visible={toast.visible} type={toast.type} message={toast.message} onHide={hideToast} />

      {/* FAB ADD MEMBER */}
      <TouchableOpacity
        onPress={() => setShowAddModal(true)}
        className="elevation-5 absolute bottom-[110px] right-6 h-16 w-16 items-center justify-center rounded-full bg-indigo-600 shadow-lg"
        style={{ zIndex: 9999 }}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* Add Member Modal */}
      <AddMemberModal
        visible={showAddModal}
        onClose={(added) => {
          setShowAddModal(false);
          if (added) reload();
        }}
      />
    </SafeAreaView>
  );
}
