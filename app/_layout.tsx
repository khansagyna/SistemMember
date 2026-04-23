import "../global.css";

import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";

import {
  View,
  ActivityIndicator
} from "react-native";

import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold
} from "@expo-google-fonts/inter";

export default function RootLayout() {

  const [session, setSession] =
    useState<Session | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold
  });

  useEffect(() => {

    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
        setLoading(false);
      });

    const { data: listener } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
        }
      );

    return () => {
      listener.subscription.unsubscribe();
    };

  }, []);

  if (loading || !fontsLoaded) {
    return (
      <View className="flex-1 justify-center items-center font-inter">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {session ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="login" />
      )}
    </Stack>
  )

}