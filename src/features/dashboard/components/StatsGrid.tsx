import { View } from 'react-native'
import StatsCard from './StatsCard'
import { StatsGridProps } from '../types/props'

export default function StatsGrid({ transactions, members, stats }: StatsGridProps) {

  return (
    <View className='flex-row flex-wrap justify-between gap-y-4'>

      <StatsCard
        title="Total Trx"
        value={transactions.length}
        icon="swap-horizontal"
        color="#4f46e5"
      />

      <StatsCard
        title="Members"
        value={members}
        icon="people"
        color="#2563eb"
      />

      <StatsCard
        title="Piutang"
        value={`Rp ${stats.unpaid}`}
        icon="wallet"
        color="#ea580c"
      />

      <StatsCard
        title="Hari Ini"
        value={stats.trxToday}
        icon="today"
        color="#059669"
      />

    </View>
  )
}