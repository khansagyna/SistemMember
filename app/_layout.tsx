import '../global.css';

import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

import { View, ActivityIndicator, Text, TextInput, Image } from 'react-native';

import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ToastProvider } from '@/shared/context/ToastContext';
import { LinearGradient } from 'expo-linear-gradient';

// Apply default font family globally
// @ts-ignore
if (Text.defaultProps == null) Text.defaultProps = {};
// @ts-ignore
Text.defaultProps.style = { fontFamily: 'Inter_400Regular' };

// @ts-ignore
if (TextInput.defaultProps == null) TextInput.defaultProps = {};
// @ts-ignore
TextInput.defaultProps.style = { fontFamily: 'Inter_400Regular' };

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);

  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading || !fontsLoaded) {
    return (
      <LinearGradient
        colors={['#ffffff', '#f4f7ff', '#f8fafc']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingVertical: 40,
        }}>
        <View style={{ flex: 1 }} />
        <View className="items-center justify-center">
          <View
            className="mb-8 items-center justify-center rounded-[44px] border border-slate-100 bg-white p-6 shadow-2xl"
            style={{
              shadowColor: '#4f46e5',
              shadowOffset: { width: 0, height: 16 },
              shadowOpacity: 0.12,
              shadowRadius: 32,
              elevation: 12,
            }}>
            <Image
              source={require('../assets/logo.png')}
              style={{ width: 110, height: 110 }}
              resizeMode="contain"
            />
          </View>
          <Text className="mb-2 font-interBold text-4xl tracking-wider text-slate-900">
            Sistem Member
          </Text>
          <Text className="font-interMedium text-base tracking-widest text-indigo-600">
            PREMIUM BUSINESS HUB
          </Text>
        </View>
        <View style={{ flex: 1 }} />
        <View className="items-center justify-center">
          <ActivityIndicator size="small" color="#4f46e5" />
          <Text className="mt-4 font-interMedium text-xs uppercase tracking-widest text-slate-400">
            Loading Application...
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ToastProvider>
          <Stack screenOptions={{ headerShown: false }}>
            {session ? <Stack.Screen name="(tabs)" /> : <Stack.Screen name="login" />}
          </Stack>
        </ToastProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
