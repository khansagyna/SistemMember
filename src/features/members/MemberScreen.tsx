import { useState } from 'react'
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
} from 'react-native'

import { useMembers } from '@/features/members/hooks/useMembers'
import { memberApi } from '@/features/members/api/member.api'
import MemberCard from '@/features/members/components/MemberCard'
import MemberCardSkeleton from '@/features/members/components/MemberCardSkeleton'
import MemberHeader from '@/features/members/components/MemberHeader'
import ConfirmModal from '@/shared/components/ConfirmModal'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import Input from '@/shared/components/Input'
import Button from '@/shared/components/Button'
import { Member } from '@/features/members/types'
import Toast from '@/shared/components/Toast'
import { useToast } from '@/shared/hooks/useToast'

export default function MemberScreen() {

  const { members, loading, reload } = useMembers()
  const [search, setSearch] = useState('')
  const { toast, showToast, hideToast } = useToast()

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Edit state
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editNameError, setEditNameError] = useState('')
  const [editPhoneError, setEditPhoneError] = useState('')
  const [updating, setUpdating] = useState(false)

  const handleDeletePress = (id: string) => {
    setDeleteId(id)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await memberApi.remove(deleteId)
      reload()
      showToast('success', 'Member berhasil dihapus')
    } catch (e) {
      showToast('error', 'Gagal menghapus member')
    }
    setDeleting(false)
    setShowDeleteModal(false)
    setDeleteId(null)
  }

  const handleEditPress = (item: Member) => {
    setEditingMember(item)
    setEditName(item.name)
    setEditPhone(item.phone)
    setEditNameError('')
    setEditPhoneError('')
  }

  const handleEditClose = () => {
    setEditingMember(null)
    setEditName('')
    setEditPhone('')
    setEditNameError('')
    setEditPhoneError('')
  }

  const handleEditSave = async () => {
    setEditNameError('')
    setEditPhoneError('')

    if (!editName) {
      setEditNameError('Nama wajib diisi')
      return
    }
    if (!editPhone) {
      setEditPhoneError('No HP wajib diisi')
      return
    }
    if (!editingMember) return

    setUpdating(true)
    try {
      await memberApi.update(editingMember.id, {
        name: editName,
        phone: editPhone,
      })
      reload()
      handleEditClose()
      showToast('success', 'Member berhasil diupdate')
    } catch (e) {
      showToast('error', 'Gagal mengupdate member')
      setEditNameError('Gagal mengupdate member')
    }
    setUpdating(false)
  }

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <SafeAreaView className='flex-1 bg-slate-50'>
        <MemberHeader
          members={[]}
          search={search}
          setSearch={setSearch}
        />
        {[...Array(5)].map((_, i) => (
          <MemberCardSkeleton key={i} />
        ))}
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className='flex-1 bg-slate-50'>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <MemberHeader
            members={members}
            search={search}
            setSearch={setSearch}
          />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-10 px-5">
            <Text className="text-slate-400 text-base text-center">
              {search ? 'Tidak ada member yang sesuai dengan pencarian.' : 'Belum ada member yang ditambahkan.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <MemberCard
            item={item}
            onDelete={handleDeletePress}
            onEdit={handleEditPress}
          />
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
          setShowDeleteModal(false)
          setDeleteId(null)
        }}
      />

      {/* Edit Member Modal */}
      {editingMember && (
        <Modal transparent animationType="slide">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-black/40 justify-end"
          >
            <ScrollView
              className="bg-white rounded-t-4xl"
              contentContainerStyle={{ flexGrow: 1 }}
            >
              {/* HEADER */}
              <LinearGradient
                colors={['#1e3a8a', '#3b82f6']}
                className="rounded-t-4xl px-6 py-6"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center">
                      <Ionicons name="pencil" size={24} color="white" />
                    </View>
                    <Text className="text-white text-2xl font-bold ml-3">
                      Edit Member
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleEditClose}
                    className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                  >
                    <Ionicons name="close" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>

              {/* FORM */}
              <View className="px-6 py-6 flex-1">
                <Input
                  label="Nama Member"
                  placeholder="Masukkan nama"
                  value={editName}
                  onChangeText={(text) => {
                    setEditName(text)
                    setEditNameError('')
                  }}
                  icon="person-outline"
                  error={editNameError}
                />

                <Input
                  label="No HP"
                  placeholder="Contoh: 081234567890"
                  value={editPhone}
                  onChangeText={(text) => {
                    setEditPhone(text)
                    setEditPhoneError('')
                  }}
                  keyboardType="phone-pad"
                  icon="call-outline"
                  error={editPhoneError}
                />

                <View className="flex-1" />

                <View className="flex-row gap-3 mb-4">
                  <Button
                    title="Batal"
                    onPress={handleEditClose}
                    variant="outline"
                    size="lg"
                    fullWidth
                  />

                  <Button
                    title="Update"
                    onPress={handleEditSave}
                    loading={updating}
                    disabled={updating}
                    size="lg"
                    fullWidth
                  />
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
      )}

      {/* Toast */}
      <Toast visible={toast.visible} type={toast.type} message={toast.message} onHide={hideToast} />
    </SafeAreaView>
  )
}