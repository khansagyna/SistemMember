
import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  TextInput
} from 'react-native'

import { useState } from 'react'
import { router } from 'expo-router'
import { supabase } from '@/lib/supabase'

import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Users
} from 'lucide-react-native'

import Input from '@/src/shared/components/Input'

export default function Login() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const handleLogin = async () => {

    setEmailError('')
    setPasswordError('')

    if (!email) {
      setEmailError('Email wajib diisi')
      return
    }

    if (!password) {
      setPasswordError('Password wajib diisi')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    setLoading(false)

    if (error) {
      setEmailError('Login gagal')
      return
    }

    router.replace('/(tabs)/dashboard')
  }

  return (
    <View className='flex-1 bg-slate-50 justify-center px-6'>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >

        <View className='bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm'>

          <View className='items-center mb-8'>

            <View className='w-20 h-20 rounded-[28px] bg-indigo-600 items-center justify-center mb-5'>
              <Users
                size={34}
                color='white'
                strokeWidth={2.5}
              />
            </View>

            <Text className='text-3xl font-interBold text-slate-900'>
              Welcome Back
            </Text>

            <Text className='text-slate-500 mt-3 text-center font-inter'>
              Kelola transaksi, member dan promo
              secara terpusat.
            </Text>

          </View>

          <View className="mb-5">

            <Text className="mb-2 font-interMedium text-slate-700">
              Email
            </Text>

            <View className="bg-slate-100 rounded-2xl px-4 py-4 flex-row items-center">

              <Mail
                size={18}
                color="#64748b"
              />

              <TextInput
                placeholder="email@example.com"
                value={email}
                onChangeText={setEmail}
                className="ml-3 flex-1 font-inter"
              />

            </View>

          </View>
          <View className="mb-6">

            <Text className="mb-2 font-interMedium text-slate-700">
              Password
            </Text>

            <View className="bg-slate-100 rounded-2xl px-4 py-4 flex-row items-center">

              <Lock
                size={18}
                color="#64748b"
              />

              <TextInput
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                className="ml-3 flex-1 font-inter"
              />

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
              >

                {showPassword ? (
                  <EyeOff size={18} color="#64748b" />
                ) : (
                  <Eye size={18} color="#64748b" />
                )}

              </TouchableOpacity>

            </View>

          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className='bg-indigo-600 p-5 rounded-2xl'
          >
            <Text className='text-white text-center font-interBold text-base'>
              {loading ? 'Loading...' : 'Masuk'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className='mt-5 items-center'>
            <Text className='text-indigo-600 font-interMedium'>
              Lupa password?
            </Text>
          </TouchableOpacity>

          <View className='mt-8 items-center'>
            <Text className='text-xs text-slate-400 font-inter'>
              Sistem Member v1.0
            </Text>
          </View>

        </View>

      </KeyboardAvoidingView>

    </View>
  )
}
