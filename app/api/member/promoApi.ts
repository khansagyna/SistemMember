import { supabase } from '@/utils/supabase'

export const getMembers = async () => {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const deleteMember = async (id: string) => {
  const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', id)

  if (error) throw error
}