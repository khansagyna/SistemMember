import { useState } from "react";
import { useToast } from "@/shared/hooks/useToast";
import { transactionApi } from "@/features/transactions/api/transaction.api";

export function useUpdateTransaction(onSuccess?: () => void) {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleUpdate = async ({
        id,
        amount,
        discount,
        paid,
    }: {
        id: string;
        amount: number;
        discount: number;
        paid: boolean;
    }) => {
        if (!amount) {
            showToast("error", "Harga tidak boleh kosong");
            return;
        }


        try {
            setLoading(true);

            await transactionApi.update(id, {
                amount,
                discount,
                paid,
            });

            showToast("success", "Transaksi berhasil diupdate");
            onSuccess?.();
        } catch (err) {
            showToast("error", "Gagal update transaksi");
        } finally {
            setLoading(false);
        }


    };

    return { handleUpdate, loading };
}
