import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from "react-native";
import { supabase } from "@/utils/supabase";
import AddTransactionModal from "../transaction/AddTransactionModal";
import EditTransactionModal from "../transaction/EditTransactionModal";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const screenWidth = Dimensions.get("window").width;

interface Transaction {
  id: string;
  name: string;
  phone: string;
  amount: number;
  discount: number;
  paid: boolean;
  transaction_count: number;
  created_at: string;
}

export default function TransactionScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setTransactions(data as Transaction[]);
  };

  useEffect(() => {
  let isMounted = true; // track mounting

  const loadData = async () => {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (isMounted && data) setTransactions(data as Transaction[]);
  };

  loadData();

  const channel = supabase
    .channel("realtime-transactions")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "transactions" },
      () => {
        if (isMounted) loadData();
      }
    )
    .subscribe();

  return () => {
    isMounted = false; // mark unmounted
    supabase.removeChannel(channel);
  };
}, []);

  const totalPendapatanBulanIni = transactions
    .filter((t) => {
      const d = new Date(t.created_at);
      const now = new Date();
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear() &&
        t.paid
      );
    })
    .reduce((sum, t) => sum + (t.amount - t.discount), 0);

  const generateMonthlyReport = async () => {
    try {
      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();

      const monthly = transactions.filter((t) => {
        const d = new Date(t.created_at);
        return d.getMonth() === month && d.getFullYear() === year && t.paid;
      });

      const total = monthly.reduce(
        (sum, t) => sum + (t.amount - t.discount),
        0
      );

      const rows = monthly
        .map(
          (t) => `
        <tr>
          <td>${t.name}</td>
          <td>${t.phone}</td>
          <td>Rp ${(t.amount - t.discount).toLocaleString()}</td>
        </tr>
      `
        )
        .join("");

      const html = `
        <h1>Laporan Bulanan ${month + 1}/${year}</h1>
        <table border="1" cellpadding="8" cellspacing="0" width="100%">
          <tr>
            <th>Nama</th>
            <th>Phone</th>
            <th>Total</th>
          </tr>
          ${rows}
        </table>
        <h2>Total: Rp ${total.toLocaleString()}</h2>
      `;

      const { uri } = await Print.printToFileAsync({ html });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Hapus Transaksi", "Apakah kamu yakin ingin menghapus?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          await supabase.from("transactions").delete().eq("id", id);
        },
      },
    ]);
  };

  const filtered = transactions.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 bg-slate-100 px-4 pt-6">
      {/* HEADER */}
      <Text className="text-3xl font-bold mb-6 mt-10 text-gray-800 ">Transaksi</Text>

      {/* TOTAL & CETAK LAPORAN */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="bg-white rounded-xl shadow-md p-3 flex-1 mr-2">
          <Text className="text-gray-500 text-sm">Total Pendapatan Bulan Ini</Text>
          <Text className="text-indigo-600 font-bold text-lg">
            Rp {totalPendapatanBulanIni.toLocaleString()}
          </Text>
        </View>

        <TouchableOpacity
          onPress={generateMonthlyReport}
          className="bg-indigo-600 px-4 py-3 rounded-xl shadow-md"
        >
          <Text className="text-white font-semibold text-sm">Cetak Laporan</Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      <TextInput
        placeholder="Cari customer..."
        value={search}
        onChangeText={setSearch}
        className="bg-white p-3 rounded-xl mb-4 shadow-sm"
      />

      {/* LIST TRANSAKSI */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 150 }}
        renderItem={({ item }) => (
          <View className="bg-white p-5 rounded-2xl mb-4 shadow-md">
            <View className="flex-row justify-between">
              <View>
                <Text className="font-bold text-lg text-gray-800">{item.name}</Text>
                <Text className="text-gray-500 mt-1">{item.phone}</Text>
                <Text className="text-gray-400 mt-1 text-sm">
                  {new Date(item.created_at).toLocaleDateString()} - Transaksi ke {item.transaction_count}
                </Text>
              </View>

              <View className="items-end">
                <Text className="text-indigo-600 font-bold text-lg">
                  Rp {(item.amount - item.discount).toLocaleString()}
                </Text>

                <View
                  className={`mt-2 px-3 py-1 rounded-full ${
                    item.paid ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      item.paid ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.paid ? "Paid" : "Unpaid"}
                  </Text>
                </View>
              </View>
            </View>

            {item.discount > 0 && (
              <View className="bg-green-50 p-3 rounded-lg mt-3">
                <Text className="font-bold text-green-600">🎉 Promo Diskon!</Text>
                <Text>Harga Awal: Rp {item.amount.toLocaleString()}</Text>
                <Text>Diskon: Rp {item.discount.toLocaleString()}</Text>
                <Text>
                  Setelah Diskon: Rp {(item.amount - item.discount).toLocaleString()}
                </Text>
              </View>
            )}

            {/* ACTION BUTTONS */}
            <View className="flex-row gap-3 mt-4">
              <TouchableOpacity
                className="flex-1 bg-indigo-600 p-3 rounded-xl items-center shadow-sm"
                onPress={() => setSelected(item)}
              >
                <Text className="text-white font-semibold">Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-red-500 p-3 rounded-xl items-center shadow-sm"
                onPress={() => handleDelete(item.id)}
              >
                <Text className="text-white font-semibold">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* FAB */}
      <TouchableOpacity
        className="absolute bottom-12 right-5 w-16 h-16 bg-indigo-600 rounded-full items-center justify-center shadow-lg"
        onPress={() => setShowAdd(true)}
      >
        <Text className="text-white text-3xl font-bold">+</Text>
      </TouchableOpacity>

      {showAdd && (
        <AddTransactionModal
          onClose={(newDataAdded?: boolean) => {
            setShowAdd(false);
            if (newDataAdded) fetchData();
          }}
        />
      )}

      {selected && (
        <EditTransactionModal
          data={selected}
          onClose={(updated?: boolean) => {
            setSelected(null);
            if (updated) fetchData();
          }}
        />
      )}
    </View>
  );
}