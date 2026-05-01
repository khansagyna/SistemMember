import { useEffect, useState } from "react";
import { transactionApi } from "@/features/transactions/api/transaction.api";
import { useToast } from "@/shared/hooks/useToast";
import { supabase } from "@/lib/supabase";

export function useAddTransaction(onSuccess?: () => void) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [amount, setAmount] = useState("");
    const [paid, setPaid] = useState(true);

    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [allMembers, setAllMembers] = useState<any[]>([]);
    const [searchMember, setSearchMember] = useState("");
    const [activePromo, setActivePromo] = useState<any>(null);
    const [transactionCount, setTransactionCount] = useState(0);
    const [autoDiscount, setAutoDiscount] = useState(0);
    const [loading, setLoading] = useState(false);

    const { showToast } = useToast();

    useEffect(() => {
        fetchPromo();
        fetchAllMembers();
    }, []);

    const fetchPromo = async () => {
        const data = await transactionApi.getActivePromo();
        setActivePromo(data);
    };

    const fetchAllMembers = async () => {
        const { data } = await supabase
            .from('members')
            .select('*')
            .order('name', { ascending: true });
        setAllMembers(data || []);
    };

    const filteredMembers = allMembers.filter(m =>
        m.name.toLowerCase().includes(searchMember.toLowerCase()) ||
        m.phone.includes(searchMember)
    );

    const handleSelectMember = (member: any) => {
        setName(member.name);
        setPhone(member.phone);
        setSearchMember(""); // Reset search after selection
    };

    useEffect(() => {
        if (!phone) return;

        const run = async () => {
            const count = await transactionApi.getLastTransactionCount(phone);
            setTransactionCount(count);
        };

        run();


    }, [phone]);

    useEffect(() => {
        if (!amount || !activePromo) return setAutoDiscount(0);

        const next = transactionCount + 1;

        if (
            next >= activePromo.target_transaction &&
            Number(amount) >= activePromo.minimum_amount
        ) {
            setAutoDiscount((Number(amount) * activePromo.discount_percent) / 100);
        } else {
            setAutoDiscount(0);
        }


    }, [amount, transactionCount, activePromo]);

    const handleSave = async () => {
        if (!name || !phone || !amount) {
            showToast("error", "Lengkapi semua field");
            return;
        }


        try {
            setLoading(true);

            await transactionApi.create({
                name,
                phone,
                amount: Number(amount),
                discount: autoDiscount,
                paid,
                transaction_count: transactionCount + 1,
            });

            showToast("success", "Transaksi berhasil ditambahkan");
            onSuccess?.();
        } catch {
            showToast("error", "Gagal menambahkan transaksi");
        } finally {
            setLoading(false);
        }


    };

    return {
        name, setName,
        phone, setPhone,
        amount, setAmount,
        paid, setPaid,
        searchMember, setSearchMember,
        filteredMembers,
        handleSelectMember,
        activePromo,
        autoDiscount,
        loading,
        handleSave,
    };
}
