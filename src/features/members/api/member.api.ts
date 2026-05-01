import { supabase } from '@/lib/supabase'
import { Member } from '../types'

export const memberApi = {

  getAll: async (): Promise<Member[]> => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data ?? []
  },

  update: async (id: string, data: { name: string; phone: string }) => {
    const { error } = await supabase
      .from('members')
      .update(data)
      .eq('id', id)

    if (error) throw error
  },

  remove: async (id: string) => {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

}