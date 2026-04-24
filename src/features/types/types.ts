export type Transaction = {
  id: string
  name: string
  phone: string
  amount: number
  discount?: number
  paid: boolean
  created_at: string
}

export type TransactionInsert = {
  name: string
  phone: string
  amount: number
  discount: number
  paid: boolean
  transaction_count: number
}