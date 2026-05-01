import { useEffect, useMemo, useState } from 'react'
import { dashboardApi } from '../api/dashboard.api'
import { Transaction } from '@/features/types/types'

export function useDashboard() {

    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [members, setMembers] = useState(0)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const load = async () => {
        setLoading(true)

        const [trx, mem] = await Promise.all([
            dashboardApi.getTransactions(),
            dashboardApi.getMembersCount()
        ])

        setTransactions(trx)
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
        const today = new Date().toDateString()
        const thisMonth = new Date().getMonth()
        const thisYear = new Date().getFullYear()

        const todayTrx = transactions.filter(
            t => new Date(t.created_at).toDateString() === today
        )

        const omzet = todayTrx.reduce(
            (a, t) => a + ((t.amount || 0) - (t.discount || 0)), 0
        )

        const omzetBulanIni = transactions
            .filter(t => {
                const d = new Date(t.created_at)
                return d.getMonth() === thisMonth && d.getFullYear() === thisYear
            })
            .reduce((a, t) => a + ((t.amount || 0) - (t.discount || 0)), 0)

        const totalOmzet = transactions.reduce(
            (a, t) => a + ((t.amount || 0) - (t.discount || 0)), 0
        )

        const unpaid = transactions
            .filter(t => !t.paid)
            .reduce(
                (a, t) => a + ((t.amount || 0) - (t.discount || 0)), 0
            )

        return {
            trxToday: todayTrx.length,
            omzet,
            omzetBulanIni,
            totalOmzet,
            unpaid
        }
    }, [transactions])

    return {
        transactions,
        members,
        loading,
        refreshing,
        refresh,
        stats
    }
}