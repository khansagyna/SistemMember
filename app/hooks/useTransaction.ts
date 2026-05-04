import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { transactionApi } from '../api/transaction/transactionApi';
import { Transaction } from '@/features/types/types';

export function useTransactions() {
  const [search, setSearch] = useState('');
  const [filterPaid, setFilterPaid] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadData = async () => {
    setLoading(true);

    const data = await transactionApi.getAll();

    setTransactions(data);

    setLoading(false);
  };

  useEffect(() => {
    loadData();

    const channel = supabase
      .channel('trx-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
        },
        loadData
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = useMemo(() => {
    return transactions.filter((t: any) => {
      const match = t.name.toLowerCase().includes(search.toLowerCase());

      if (filterPaid === 'paid') return match && t.paid;

      if (filterPaid === 'unpaid') return match && !t.paid;

      return match;
    });
  }, [transactions, search, filterPaid]);
  const paidCount = transactions.filter((t: any) => t.paid).length;

  const unpaidCount = transactions.filter((t: any) => !t.paid).length;

  const revenue = transactions
    .filter((t: any) => t.paid)
    .reduce((acc: number, t: any) => acc + ((t.amount || 0) - (t.discount || 0)), 0);

  return {
    transactions,
    filtered,

    search,
    setSearch,

    filterPaid,
    setFilterPaid,

    loading,

    loadData,

    paidCount,
    unpaidCount,
    revenue,
  };
}
