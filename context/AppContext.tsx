import React, { createContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Member {
  id: string;
  name: string;
  phone: string;
}

export interface Transaction {
  id: string;
  member_id: string;
  amount: number;
  discount: number;
  created_at: string;
  members?: {
    name: string;
  };
}

interface AppContextType {
  members: Member[];
  transactions: Transaction[];
  fetchMembers: () => void;
  fetchTransactions: () => void;
  addMember: (name: string, phone: string) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  addTransaction: (member_id: string, amount: number, discount: number) => Promise<void>;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchMembers = async () => {
    const { data } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setMembers(data);
  };

  const fetchTransactions = async () => {
    const { data } = await supabase
      .from("transactions")
      .select(`*, members(name)`)
      .order("created_at", { ascending: false });

    if (data) setTransactions(data);
  };

  const addMember = async (name: string, phone: string) => {
    await supabase.from("members").insert([{ name, phone }]);
    fetchMembers();
  };

  const deleteMember = async (id: string) => {
    await supabase.from("members").delete().eq("id", id);
    fetchMembers();
  };

  const addTransaction = async (
    member_id: string,
    amount: number,
    discount: number
  ) => {
    await supabase.from("transactions").insert([
      { member_id, amount, discount },
    ]);
    fetchTransactions();
  };

  useEffect(() => {
    fetchMembers();
    fetchTransactions();
  }, []);

  return (
    <AppContext.Provider
      value={{
        members,
        transactions,
        fetchMembers,
        fetchTransactions,
        addMember,
        deleteMember,
        addTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
