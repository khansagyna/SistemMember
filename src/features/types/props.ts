import { Transaction } from "./types"

export type TransactionItemProps = {
  item: Transaction
  formatRupiah: (n: number) => string
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
