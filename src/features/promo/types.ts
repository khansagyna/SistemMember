export interface Promo {
  id: string
  name: string
  target_transaction: number
  discount_percent: number
  minimum_amount: number
  is_active: boolean
  created_at: string
}

export interface PromoInsert {
  name: string
  target_transaction: number
  discount_percent: number
  minimum_amount: number
  is_active: boolean
}