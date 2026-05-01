import { Transaction } from "./types"

export type TransactionItemProps = {
  item: Transaction
  formatRupiah: (n: number) => string
  onDelete?: (id: string) => void
  onEdit?: (item: Transaction) => void
}

export type TransactionHeaderProps = {
  search: string
  setSearch: (v: string) => void
  filterPaid: 'all' | 'paid' | 'unpaid'
  setFilterPaid: (v: 'all' | 'paid' | 'unpaid') => void
  revenue: number
  paidCount: number
  unpaidCount: number
  formatRupiah: (n: number) => string
}

export type TransactionListProps = {
  transactions: Transaction[]
  loading: boolean
  formatRupiah: (n: number) => string
  onDelete?: (id: string) => void
  onEdit?: (item: Transaction) => void
}

export type AddTransactionModalProps = {
  visible: boolean
  onClose: (updated?: boolean) => void
}

export type EditTransactionModalProps = {
  visible: boolean
  data: any
  onClose: (updated?: boolean) => void
}
