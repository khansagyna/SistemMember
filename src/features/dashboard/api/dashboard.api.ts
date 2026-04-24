import { supabase } from '@/lib/supabase'
import { Transaction } from '@/features/types/types'

export const dashboardApi = {

    getTransactions: async (): Promise<Transaction[]> => {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        return data ?? []
    },

    getMembersCount: async (): Promise<number> => {
        const { count, error } = await supabase
            .from('members')
            .select('*', { count: 'exact', head: true })

        if (error) throw error

        return count ?? 0
    }
}