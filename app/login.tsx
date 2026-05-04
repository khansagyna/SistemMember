import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  TextInput,
  Animated,
} from 'react-native';

import { useState, useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

import { Lock, Mail, Eye, EyeOff, Users, AlertCircle, CheckCircle } from 'lucide-react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Banner states
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Animations
  const errorOpacity = useRef(new Animated.Value(0)).current;
  const errorTranslateY = useRef(new Animated.Value(-10)).current;
  const errorShake = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0.9)).current;

  // Show error banner with shake
  const showError = (msg: string) => {
    setErrorMessage(msg);
    errorOpacity.setValue(0);
    errorTranslateY.setValue(-10);
    errorShake.setValue(0);

    Animated.parallel([
      Animated.timing(errorOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(errorTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Shake animation
      Animated.sequence([
        Animated.timing(errorShake, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(errorShake, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(errorShake, { toValue: 6, duration: 60, useNativeDriver: true }),
        Animated.timing(errorShake, { toValue: -6, duration: 60, useNativeDriver: true }),
        Animated.timing(errorShake, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
    });

    // Auto dismiss after 4s
    setTimeout(() => {
      Animated.timing(errorOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setErrorMessage(''));
    }, 4000);
  };

  // Show success banner
  const showSuccessBanner = () => {
    setShowSuccess(true);
    successOpacity.setValue(0);
    successScale.setValue(0.9);

    Animated.parallel([
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(successScale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Clear error when typing
  const handleEmailChange = (text: string) => {
    setEmail(text);
    setEmailError('');
    if (errorMessage) {
      setErrorMessage('');
      errorOpacity.setValue(0);
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordError('');
    if (errorMessage) {
      setErrorMessage('');
      errorOpacity.setValue(0);
    }
  };

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');
    setErrorMessage('');

    if (!email) {
      setEmailError('Email wajib diisi');
      return;
    }

    if (!password) {
      setPasswordError('Password wajib diisi');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      if (error.message.includes('Invalid login')) {
        showError('Email atau password salah');
      } else if (error.message.includes('network')) {
        showError('Koneksi gagal. Periksa internet Anda');
      } else {
        showError('Login gagal. Silakan coba lagi');
      }
      return;
    }

    // Show success then navigate
    showSuccessBanner();
    setTimeout(() => {
      router.replace('/(tabs)/dashboard');
    }, 800);
  };

  return (
    <View className="flex-1 justify-center bg-slate-50 px-6">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <View className="mb-8 items-center">
            <View className="mb-5 h-20 w-20 items-center justify-center rounded-[28px] bg-indigo-600">
              <Users size={34} color="white" strokeWidth={2.5} />
            </View>

            <Text className="font-interBold text-3xl text-slate-900">Welcome Back</Text>

            <Text className="mt-3 text-center font-inter text-slate-500">
              Kelola transaksi, member dan promo secara terpusat.
            </Text>
          </View>

          {/* Error Banner */}
          {errorMessage !== '' && (
            <Animated.View
              style={{
                opacity: errorOpacity,
                transform: [{ translateY: errorTranslateY }, { translateX: errorShake }],
              }}
              className="mb-5 flex-row items-center rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
              <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-red-100">
                <AlertCircle size={18} color="#ef4444" />
              </View>
              <Text className="flex-1 font-interMedium text-sm text-red-700">{errorMessage}</Text>
            </Animated.View>
          )}

          {/* Success Banner */}
          {showSuccess && (
            <Animated.View
              style={{
                opacity: successOpacity,
                transform: [{ scale: successScale }],
              }}
              className="mb-5 flex-row items-center rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle size={18} color="#059669" />
              </View>
              <Text className="flex-1 font-interMedium text-sm text-emerald-700">
                Login berhasil! Mengalihkan...
              </Text>
            </Animated.View>
          )}

          <View className="mb-5">
            <Text className="mb-2 font-interMedium text-slate-700">Email</Text>

            <View
              className={`flex-row items-center rounded-2xl bg-slate-100 px-4 py-4 ${emailError ? 'border border-red-300' : ''}`}>
              <Mail size={18} color={emailError ? '#ef4444' : '#64748b'} />

              <TextInput
                placeholder="email@example.com"
                value={email}
                onChangeText={handleEmailChange}
                className="ml-3 flex-1 font-inter"
              />
            </View>

            {emailError !== '' && (
              <Text className="ml-1 mt-1.5 font-inter text-sm text-red-500">{emailError}</Text>
            )}
          </View>
          <View className="mb-6">
            <Text className="mb-2 font-interMedium text-slate-700">Password</Text>

            <View
              className={`flex-row items-center rounded-2xl bg-slate-100 px-4 py-4 ${passwordError ? 'border border-red-300' : ''}`}>
              <Lock size={18} color={passwordError ? '#ef4444' : '#64748b'} />

              <TextInput
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={handlePasswordChange}
                className="ml-3 flex-1 font-inter"
              />

              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={18} color="#64748b" />
                ) : (
                  <Eye size={18} color="#64748b" />
                )}
              </TouchableOpacity>
            </View>

            {passwordError !== '' && (
              <Text className="ml-1 mt-1.5 font-inter text-sm text-red-500">{passwordError}</Text>
            )}
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading || showSuccess}
            className={`rounded-2xl p-5 ${showSuccess ? 'bg-emerald-500' : 'bg-indigo-600'}`}>
            <Text className="text-center font-interBold text-base text-white">
              {loading ? 'Loading...' : showSuccess ? 'Berhasil ✓' : 'Masuk'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="mt-5 items-center">
            <Text className="font-interMedium text-indigo-600">Lupa password?</Text>
          </TouchableOpacity>

          <View className="mt-8 items-center">
            <Text className="font-inter text-xs text-slate-400">Sistem Member v1.0</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
