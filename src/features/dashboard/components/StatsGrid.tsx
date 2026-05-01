import { View } from 'react-native'
import StatsCard, { IconName } from './StatsCard'
import StatsCardSkeleton from './StatsCardSkeleton'
import { StatsGridProps } from '../types/props'

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID').format(value)

type StatItem = {
  title: string
  value: string | number
  icon: IconName
  color: string
}

export default function StatsGrid({
  transactions,
  members,
  stats,
  loading,
}: StatsGridProps) {

  const data: StatItem[] = [
    {
      title: 'Total Omzet',
      value: `Rp ${formatRupiah(stats.totalOmzet)}`,
      icon: 'cash',
      color: '#059669',
    },
    {
      title: 'Omzet Bulanan',
      value: `Rp ${formatRupiah(stats.omzetBulanIni)}`,
      icon: 'calendar',
      color: '#2563eb',
    },
    {
      title: 'Total Piutang',
      value: `Rp ${formatRupiah(stats.unpaid)}`,
      icon: 'wallet',
      color: '#ea580c',
    },
    {
      title: 'Total Transaksi',
      value: transactions.length,
      icon: 'swap-horizontal',
      color: '#4f46e5',
    },
    {
      title: 'Members',
      value: members,
      icon: 'people',
      color: '#8b5cf6',
    },
    {
      title: 'Trx Hari Ini',
      value: stats.trxToday,
      icon: 'today',
      color: '#14b8a6',
    },
  ]

  return (
<View
  style={{
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 1,
  }}
>
  {loading ? (
    [...Array(6)].map((_, index) => (
      <View
        key={`skeleton-${index}`}
        style={{
          width: '50%',
          padding: 6,
        }}
      >
        <StatsCardSkeleton />
      </View>
    ))
  ) : (
    data.map((item, index) => (
      <View
        key={index}
        style={{
          width: '50%',
          padding: 6,
        }}
      >
        <StatsCard {...item} />
      </View>
    ))
  )}
</View>
  )
}