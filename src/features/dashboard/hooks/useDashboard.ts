import { useEffect, useMemo, useState } from 'react'
import { dashboardApi } from '../api/dashboard.api'
import { Transaction } from '@/features/types/types'

export function useDashboard() {

    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
    const [allTransactions, setAllTransactions] = useState<any[]>([])
    const [todayTransactions, setTodayTransactions] = useState<Transaction[]>([])
    const [members, setMembers] = useState(0)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const load = async () => {
        setLoading(true)

        const [recent, all, today, mem] = await Promise.all([
            dashboardApi.getRecentTransactions(),
            dashboardApi.getAllTransactions(),
            dashboardApi.getTodayTransactions(),
            dashboardApi.getMembersCount()
        ])

        setRecentTransactions(recent)
        setAllTransactions(all)
        setTodayTransactions(today)
        setMembers(mem)
        setLoading(false)
    }

    const refresh = async () => {
        setRefreshing(true)
        await load()
        setRefreshing(false)
    }

    useEffect(() => {
        load()
    }, [])

    const stats = useMemo(() => {
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        // Akurat Hari Ini
        const omzet = todayTransactions.reduce(
            (a, t) => a + ((t.amount || 0) - (t.discount || 0)), 0
        )

        // Akurat Bulan Ini (dari allTransactions)
        const omzetBulanIni = allTransactions
            .filter(t => {
                const d = new Date(t.created_at)
                return d.getMonth() === thisMonth && d.getFullYear() === thisYear
            })
            .reduce((a, t) => a + ((t.amount || 0) - (t.discount || 0)), 0)

        // Akurat Total (dari allTransactions)
        const totalOmzet = allTransactions.reduce(
            (a, t) => a + ((t.amount || 0) - (t.discount || 0)), 0
        )

        // Akurat Piutang (dari allTransactions)
        const unpaidAmount = allTransactions
            .filter(t => !t.paid)
            .reduce((a, t) => a + ((t.amount || 0) - (t.discount || 0)), 0)

        return {
            trxToday: todayTransactions.length,
            omzet,
            omzetBulanIni,
            totalOmzet,
            unpaid: unpaidAmount
        }
    }, [todayTransactions, allTransactions])

    return {
        transactions: recentTransactions,
        members,
        loading,
        refreshing,
        refresh,
        stats
    }
}