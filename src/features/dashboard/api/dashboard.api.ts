import { supabase } from '@/lib/supabase';
import { Transaction } from '@/features/types/types';

export const dashboardApi = {
  getRecentTransactions: async (): Promise<Transaction[]> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data ?? [];
  },

  getAllTransactions: async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, discount, created_at, paid')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  getTodayTransactions: async (): Promise<Transaction[]> => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('created_at', today);

    if (error) throw error;
    return data ?? [];
  },

  getMembersCount: async (): Promise<number> => {
    const { count, error } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count ?? 0;
  },
};
