import { supabase } from '@/lib/supabase'
import { Promo, PromoInsert } from '../types'

export const promoApi = {
  getAll: async (): Promise<Promo[]> => {
    const { data, error } = await supabase
      .from('promo')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data ?? []
  },

  create: async (payload: PromoInsert) => {
    const { error } = await supabase
      .from('promo')
      .insert(payload)

    if (error) throw error
  },

  activate: async (id: string) => {
    // Nonaktifkan semua promo lain dulu
    await supabase.from('promo').update({ is_active: false }).neq('id', id)
    // Aktifkan promo terpilih
    const { error } = await supabase.from('promo').update({ is_active: true }).eq('id', id)

    if (error) throw error
  },

  remove: async (id: string) => {
    const { error } = await supabase
      .from('promo')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
