
import { useEffect, useState } from 'react'
import {
    SafeAreaView, View, Text, FlatList,
    TouchableOpacity, TextInput,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '@/lib/supabase'
import ConfirmModal from '@/shared/components/ConfirmModal'
import Toast from '@/shared/components/Toast'
import { useToast } from '@/shared/hooks/useToast'

export default function PromoPage() {
    const [promos, setPromos] = useState<any[]>([])
    const [showForm, setShowForm] = useState(false)
    const [name, setName] = useState('')
    const [target, setTarget] = useState('')
    const [discount, setDiscount] = useState('')
    const [minimum, setMinimum] = useState('')

    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [activateId, setActivateId] = useState<string | null>(null)
    const [showActivateModal, setShowActivateModal] = useState(false)
    const [activating, setActivating] = useState(false)
    const [showSaveModal, setShowSaveModal] = useState(false)
    const [saving, setSaving] = useState(false)
    const { toast, showToast, hideToast } = useToast()

    useEffect(() => {
        loadData()
        const channel = supabase
            .channel('promo-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'promo' }, () => loadData())
            .subscribe()
        return () => { supabase.removeChannel(channel) }
    }, [])

    const loadData = async () => {
        const { data } = await supabase.from('promo').select('*').order('created_at', { ascending: false })
        setPromos(data || [])
    }

    const handleAddPress = () => {
        if (!name || !target || !discount || !minimum) return
        setShowSaveModal(true)
    }

    const handleAddConfirm = async () => {
        setSaving(true)
        try {
            await supabase.from('promo').insert({ name, target_transaction: Number(target), discount_percent: Number(discount), minimum_amount: Number(minimum), is_active: false })
            setName(''); setTarget(''); setDiscount(''); setMinimum('')
            setShowForm(false); setSaving(false); setShowSaveModal(false)
            showToast('success', 'Promo berhasil ditambahkan')
        } catch (e) {
            showToast('error', 'Gagal menambahkan promo')
            setSaving(false)
        }
    }

    const handleDeletePress = (id: string) => { setDeleteId(id); setShowDeleteModal(true) }
    const handleDeleteConfirm = async () => {
        if (!deleteId) return
        setDeleting(true)
        try {
            await supabase.from('promo').delete().eq('id', deleteId)
            showToast('success', 'Promo berhasil dihapus')
        } catch (e) {
            showToast('error', 'Gagal menghapus promo')
        }
        setDeleting(false); setShowDeleteModal(false); setDeleteId(null)
    }

    const handleActivatePress = (id: string) => { setActivateId(id); setShowActivateModal(true) }
    const handleActivateConfirm = async () => {
        if (!activateId) return
        setActivating(true)
        try {
            await supabase.from('promo').update({ is_active: false }).neq('id', activateId)
            await supabase.from('promo').update({ is_active: true }).eq('id', activateId)
            showToast('success', 'Promo diaktifkan')
        } catch (e) {
            showToast('error', 'Gagal mengaktifkan promo')
        }
        setActivating(false); setShowActivateModal(false); setActivateId(null)
    }

    const activePromo = promos.filter(x => x.is_active).length
    const highestDiscount = Math.max(...promos.map(x => x.discount_percent || 0), 0)

    const Header = () => (
        <View>
            <View className='bg-white px-6 pt-12 pb-6 rounded-b-[36px] shadow-sm'>
                <Text className='text-3xl font-interBold text-slate-900'>Promo</Text>
                <Text className='text-slate-500 mt-2 font-inter'>Kelola rule promo loyalitas</Text>
            </View>
            <View className='px-5 mt-5'>
                <View className='bg-white rounded-3xl p-5 border border-slate-100 shadow-sm'>
                    <View className='flex-row justify-between'>
                        <View>
                            <Text className='text-slate-500 text-sm font-inter'>Active</Text>
                            <Text className='text-xl font-interBold mt-2'>{activePromo}</Text>
                        </View>
                        <View>
                            <Text className='text-slate-500 text-sm font-inter'>Rules</Text>
                            <Text className='text-xl font-interBold mt-2'>{promos.length}</Text>
                        </View>
                        <View>
                            <Text className='text-slate-500 text-sm font-inter'>Max</Text>
                            <Text className='text-xl font-interBold mt-2'>{highestDiscount}%</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={() => setShowForm(!showForm)} className='bg-indigo-600 rounded-3xl p-5 mt-5'>
                    <Text className='text-white font-interBold'>+ Tambah Promo</Text>
                </TouchableOpacity>
                {showForm && (
                    <View className='bg-white rounded-3xl p-5 mt-4 border border-slate-100'>
                        <TextInput placeholder='Nama Promo' value={name} onChangeText={setName} className='bg-slate-100 p-4 rounded-2xl mb-3 font-inter' />
                        <TextInput placeholder='Target transaksi' value={target} onChangeText={setTarget} className='bg-slate-100 p-4 rounded-2xl mb-3 font-inter' />
                        <TextInput placeholder='Diskon %' value={discount} onChangeText={setDiscount} className='bg-slate-100 p-4 rounded-2xl mb-3 font-inter' />
                        <TextInput placeholder='Minimum belanja' value={minimum} onChangeText={setMinimum} className='bg-slate-100 p-4 rounded-2xl mb-4 font-inter' />
                        <TouchableOpacity onPress={handleAddPress} className='bg-indigo-600 p-4 rounded-2xl'>
                            <Text className='text-white text-center font-interBold'>Simpan Promo</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <Text className='text-xl font-interBold mt-8 mb-4'>Promo Rules</Text>
            </View>
        </View>
    )

    return (
        <SafeAreaView className='flex-1 bg-slate-100'>
            <FlatList
                data={promos}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={<Header />}
                contentContainerStyle={{ paddingBottom: 120 }}
                renderItem={({ item }) => (
                    <View className='px-5'>
                        <View className='bg-white rounded-3xl p-5 mb-3 border border-slate-100 shadow-sm'>
                            <View className='flex-row justify-between'>
                                <View className='flex-1'>
                                    <Text className='font-interBold text-lg'>{item.name}</Text>
                                    <View className='flex-row gap-2 mt-3'>
                                        <View className='bg-slate-100 px-3 py-1 rounded-full'>
                                            <Text className='text-xs font-interMedium'>Trx ke-{item.target_transaction}</Text>
                                        </View>
                                        <View className='bg-indigo-100 px-3 py-1 rounded-full'>
                                            <Text className='text-xs text-indigo-700 font-interMedium'>{item.discount_percent}% OFF</Text>
                                        </View>
                                        {item.is_active && (
                                            <View className='bg-emerald-100 px-3 py-1 rounded-full'>
                                                <Text className='text-xs text-emerald-700 font-interMedium'>ACTIVE</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text className='text-slate-500 mt-3 font-inter'>Minimum Rp {item.minimum_amount.toLocaleString()}</Text>
                                </View>
                                <View className='items-end'>
                                    {!item.is_active && (
                                        <TouchableOpacity onPress={() => handleActivatePress(item.id)} className='mb-4'>
                                            <Ionicons name='toggle-outline' size={24} color='#059669' />
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity onPress={() => handleDeletePress(item.id)}>
                                        <Ionicons name='trash-outline' size={20} color='#dc2626' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            />
            <TouchableOpacity className='absolute bottom-8 right-6 bg-indigo-600 w-16 h-16 rounded-full items-center justify-center shadow-lg' onPress={() => setShowForm(true)}>
                <Ionicons name='add' size={32} color='white' />
            </TouchableOpacity>

            <ConfirmModal visible={showDeleteModal} title="Hapus Promo" message="Yakin ingin menghapus promo ini? Tindakan ini tidak dapat dibatalkan." confirmText="Hapus" cancelText="Batal" variant="danger" icon="trash-outline" loading={deleting} onConfirm={handleDeleteConfirm} onCancel={() => { setShowDeleteModal(false); setDeleteId(null) }} />
            <ConfirmModal visible={showActivateModal} title="Aktifkan Promo" message="Promo lain yang sedang aktif akan dinonaktifkan. Lanjutkan?" confirmText="Aktifkan" cancelText="Batal" variant="info" icon="toggle-outline" loading={activating} onConfirm={handleActivateConfirm} onCancel={() => { setShowActivateModal(false); setActivateId(null) }} />
            <ConfirmModal visible={showSaveModal} title="Simpan Promo" message={`Tambahkan promo "${name}" dengan diskon ${discount}%?`} confirmText="Simpan" cancelText="Batal" variant="info" icon="pricetag-outline" loading={saving} onConfirm={handleAddConfirm} onCancel={() => setShowSaveModal(false)} />
            
            <Toast visible={toast.visible} type={toast.type} message={toast.message} onHide={hideToast} />
        </SafeAreaView>
    )
}
