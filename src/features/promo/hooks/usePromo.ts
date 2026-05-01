import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { promoApi } from '../api/promo.api'
import { Promo } from '../types'
import { useToast } from '@/shared/hooks/useToast'

export function usePromo() {
  const [promos, setPromos] = useState<Promo[]>([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await promoApi.getAll()
      setPromos(data)
    } catch (e) {
      showToast('error', 'Gagal memuat data promo')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    const channel = supabase
      .channel('promo-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'promo' }, () => loadData())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const stats = useMemo(() => {
    return {
      activeCount: promos.filter(x => x.is_active).length,
      totalRules: promos.length,
      maxDiscount: Math.max(...promos.map(x => x.discount_percent || 0), 0)
    }
  }, [promos])

  return {
    promos,
    loading,
    stats,
    reload: loadData
  }
}
