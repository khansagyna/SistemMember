import { Transaction } from "./types"

export type Props = {
  item: Transaction
  formatRupiah: (n: number) => string
}