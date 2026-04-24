import { supabase } from '@/lib/supabase'
import { Member } from '@/features/members/types'
import { Promo } from '@/features/promo/types'
import { Transaction, TransactionInsert } from '@/features/types/types'

export const transactionApi = {

    getAll: async (): Promise<Transaction[]> => {
        const { data, error } = await supabase
            .from('transaction')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error;

        return data ?? []
    },

    getActivePromo: async (): Promise<Promo | null> => {
        const { data } = await supabase
            .from('promo')
            .select('*')
            .eq('is_active', true)
            .single()

        return data
    },

    searchMembers: async (name: string): Promise<Member[]> => {
        const { data } = await supabase
            .from('members')
            .select('*')
            .ilike('name', `%${name}%`)
            .limit(5)

        return data || []
    },

    getLastTransactionCount: async (phone: string): Promise<number> => {
        const { data } = await supabase
            .from('transactions')
            .select('transaction_count')
            .eq('phone', phone)
            .order('transaction_count', { ascending: false })
            .limit(1)

        return data && data.length > 0 ? data[0].transaction_count : 0
    },

    create: async (payload: TransactionInsert) => {
        const { error } = await supabase
            .from('transactions')
            .insert(payload)

        if (error) throw error
    }
}