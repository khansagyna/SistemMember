import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ConfirmVariant = 'danger' | 'warning' | 'info';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const variantConfig = {
  danger: {
    iconBg: 'bg-red-100',
    iconColor: '#ef4444',
    confirmBg: 'bg-red-500',
    confirmPress: 'bg-red-600',
    accentColor: '#ef4444',
    defaultIcon: 'trash-outline' as keyof typeof Ionicons.glyphMap,
  },
  warning: {
    iconBg: 'bg-amber-100',
    iconColor: '#f59e0b',
    confirmBg: 'bg-amber-500',
    confirmPress: 'bg-amber-600',
    accentColor: '#f59e0b',
    defaultIcon: 'warning-outline' as keyof typeof Ionicons.glyphMap,
  },
  info: {
    iconBg: 'bg-indigo-100',
    iconColor: '#6366f1',
    confirmBg: 'bg-indigo-600',
    confirmPress: 'bg-indigo-700',
    accentColor: '#6366f1',
    defaultIcon: 'information-circle-outline' as keyof typeof Ionicons.glyphMap,
  },
};

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  variant = 'info',
  icon,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const config = variantConfig[variant];
  const displayIcon = icon || config.defaultIcon;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.85);
      slideAnim.setValue(30);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View
        style={{ opacity: fadeAnim }}
        className="flex-1 items-center justify-center bg-black/50 px-8">
        <TouchableOpacity
          activeOpacity={1}
          onPress={loading ? undefined : onCancel}
          className="absolute inset-0"
        />

        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
          }}
          className="w-full overflow-hidden rounded-[28px] bg-white">
          {/* Content */}
          <View className="items-center px-6 pb-6 pt-8">
            {/* Icon Circle */}
            <View
              className={`h-16 w-16 rounded-full ${config.iconBg} mb-5 items-center justify-center`}>
              <Ionicons name={displayIcon} size={28} color={config.iconColor} />
            </View>

            {/* Title */}
            <Text className="mb-2 text-center font-interBold text-xl text-slate-900">{title}</Text>

            {/* Message */}
            <Text className="text-center font-inter leading-5 text-slate-500">{message}</Text>
          </View>

          {/* Divider */}
          <View className="mx-6 h-px bg-slate-100" />

          {/* Buttons */}
          <View className="flex-row gap-3 p-4">
            <TouchableOpacity
              onPress={onCancel}
              disabled={loading}
              className="flex-1 items-center justify-center rounded-2xl bg-slate-100 py-4"
              activeOpacity={0.7}>
              <Text className="font-interBold text-slate-600">{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              disabled={loading}
              className={`flex-1 rounded-2xl py-4 ${config.confirmBg} items-center justify-center`}
              activeOpacity={0.7}>
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="font-interBold text-white">{confirmText}</Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
