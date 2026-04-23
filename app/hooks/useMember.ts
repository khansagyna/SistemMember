import { useEffect, useState } from 'react'
import { getMembers } from '../api/member/promoApi'
import { supabase } from '@/utils/supabase'

export const useMembers = () => {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    const data = await getMembers()
    setMembers(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadData()

    const channel = supabase
      .channel('members-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'members' },
        loadData
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { members, loading, reload: loadData }
}