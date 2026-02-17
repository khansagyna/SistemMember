import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function Dashboard() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalTrx, setTotalTrx] = useState(0);
  const [totalMember, setTotalMember] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const { data: trx } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: mem } = await supabase
      .from("members")
      .select("*");

    setTransactions(trx || []);
    setTotalTrx(trx?.length || 0);
    setTotalMember(mem?.length || 0);

    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID").format(num);

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      {/* GRADIENT HEADER */}
      <LinearGradient
        colors={["#4f46e5", "#1e293b"]}
        className="px-6 pt-14 pb-12 rounded-b-[40px]"
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-3xl font-bold">
              Dashboard
            </Text>
            <Text className="text-indigo-200 mt-2">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            className="bg-white/20 px-4 py-2 rounded-xl"
          >
            <Text className="text-white font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* STAT CARDS */}
        <View className="flex-row mt-8 justify-between">
          <View className="bg-white/20 backdrop-blur-md p-5 rounded-3xl w-[48%] shadow-md">
            <Text className="text-indigo-100">Total Transaksi</Text>
            <Text className="text-white text-3xl font-bold mt-2">{totalTrx}</Text>
          </View>

          <View className="bg-white/20 backdrop-blur-md p-5 rounded-3xl w-[48%] shadow-md">
            <Text className="text-indigo-100">Total Member</Text>
            <Text className="text-white text-3xl font-bold mt-2">{totalMember}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* CONTENT */}
      <ScrollView
        className="px-6 mt-6"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text className="text-2xl font-bold mb-6">Recent Transactions</Text>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : transactions.length === 0 ? (
          <View className="bg-white p-10 rounded-3xl items-center">
            <Text className="text-gray-500 text-center">Belum ada transaksi.</Text>
          </View>
        ) : (
          transactions.slice(0, 5).map((item) => (
            <View
              key={item.id}
              className="bg-white p-6 rounded-3xl mb-5 shadow-md"
            >
              {/* HEADER: NAMA & TANGGAL */}
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="font-bold text-lg">{item.name}</Text>
                  <Text className="text-gray-500 mt-1">{item.phone}</Text>
                  <Text className="text-gray-400 mt-1 text-sm">
                    {new Date(item.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </View>

                <View className="items-end">
                  <Text className="font-bold text-lg">
                    Rp {formatRupiah(item.amount - item.discount)}
                  </Text>

                  <View
                    className={`px-3 py-1 rounded-full mt-2 ${
                      item.paid ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        item.paid ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item.paid ? "Paid" : "Unpaid"}
                    </Text>
                  </View>
                </View>
              </View>

              {/* DISKON */}
              {item.discount > 0 && (
                <View className="bg-green-50 p-4 rounded-xl mt-4 border border-green-100">
                  <Text className="font-bold text-green-700 mb-1">
                    🎉 Promo Diskon!
                  </Text>
                  <Text>Harga Awal: Rp {formatRupiah(item.amount)}</Text>
                  <Text>Diskon: Rp {formatRupiah(item.discount)}</Text>
                  <Text className="font-semibold">
                    Total Bayar: Rp {formatRupiah(item.amount - item.discount)}
                  </Text>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}