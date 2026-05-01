import React, { useEffect, useRef } from 'react'
import { Animated, Text, View, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type ToastType = 'success' | 'error'

interface ToastProps {
  visible: boolean
  type: ToastType
  message: string
  onHide: () => void
  duration?: number
}

const config = {
  success: {
    bg: 'bg-emerald-600',
    icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
    iconColor: '#fff',
  },
  error: {
    bg: 'bg-red-500',
    icon: 'alert-circle' as keyof typeof Ionicons.glyphMap,
    iconColor: '#fff',
  },
}

export default function Toast({
  visible,
  type,
  message,
  onHide,
  duration = 3000,
}: ToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current
  const opacity = useRef(new Animated.Value(0)).current
  const cfg = config[type]

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start()

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => onHide())
      }, duration)

      return () => clearTimeout(timer)
    } else {
      translateY.setValue(-100)
      opacity.setValue(0)
    }
  }, [visible])

  if (!visible) return null

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 40,
        left: 16,
        right: 16,
        zIndex: 9999,
        transform: [{ translateY }],
        opacity,
      }}
    >
      <View
        className={`${cfg.bg} rounded-2xl px-4 py-4 flex-row items-center shadow-lg`}
        style={{
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 8,
        }}
      >
        <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center mr-3">
          <Ionicons name={cfg.icon} size={20} color={cfg.iconColor} />
        </View>
        <Text className="text-white font-interMedium flex-1 text-sm" numberOfLines={2}>
          {message}
        </Text>
      </View>
    </Animated.View>
  )
}
