import { supabase } from "@/lib/supabase";

export const transactionApi = {

    getAll: async () => {

        const { data, error } = await supabase
            .from("transactions")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        return data || [];

    },

    delete: async (id: string) => {

        return await supabase
            .from("transactions")
            .delete()
            .eq("id", id);

    }

}