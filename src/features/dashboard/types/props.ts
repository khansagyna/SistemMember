import { Member } from '@/features/members/types';
import { Transaction } from './types';
import { Ionicons } from '@expo/vector-icons';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];

export type DashboardStats = {
  trxToday: number;
  omzet: number;
  unpaid: number;
  omzetBulanIni: number;
  totalOmzet: number;
};

export type TransactionItemProps = {
  item: Transaction;
  formatRupiah: (n: number) => string;
};

export type TransactionListProps = {
  transactions: Transaction[];
  loading: boolean;
  formatRupiah: (n: number) => string;
};

export type StatsGridProps = {
  transactions: Transaction[];
  members: number;
  stats: DashboardStats;
  loading?: boolean;
};

export type StatsCardProps = {
  title: string;
  value: string | number;
  icon: string;
  color: string;
};

export type QuickActionProps = {
  onGoMember: () => void;
  onGoTransaction: () => void;
};

export type DashboardProps = {
  onLogout: () => void;
  stats: {
    trxToday: number;
    unpaid: number;
    trxTodayAmount: number;
  };
  loading?: boolean;
};
