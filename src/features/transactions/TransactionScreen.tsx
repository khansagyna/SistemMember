import { SafeAreaView, Alert } from 'react-native'
import { useTransactions } from 'app/hooks/useTransaction'
import { transactionApi } from './api/transaction.api'
import TransactionHeader from './components/TransactionHeader'
import TransactionList from '@/shared/components/TransactionList'

export default function TransactionScreen() {

  const {
    filtered,
    search,
    setSearch,
    filterPaid,
    setFilterPaid,
    loading,
    revenue,
    paidCount,
    unpaidCount
  } = useTransactions()

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID').format(n)

  const handleDelete = (id: string) => {
    Alert.alert('Hapus', 'Yakin?', [
      { text: 'Batal' },
      { text: 'Hapus', onPress: () => transactionApi.remove(id) }
    ])
  }

  return (
    <SafeAreaView className='flex-1'>

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

      <TransactionList
        data={filtered}
        loading={loading}
        onDelete={handleDelete}
        formatRupiah={formatRupiah}
      />

    </SafeAreaView>
  )
}