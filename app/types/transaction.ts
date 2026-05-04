export type Transaction = {
  id: string;
  member_id: string;
  amount: number;
  discount: number;
  created_at: string;
  members?: {
    name: string;
  };
};
