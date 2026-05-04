import { Pressable, Text, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = true,
}: ButtonProps) {
  const variantStyles = {
    primary: 'bg-indigo-600 active:bg-indigo-700',
    secondary: 'bg-slate-200 active:bg-slate-300',
    danger: 'bg-red-500 active:bg-red-600',
    success: 'bg-green-500 active:bg-green-600',
    outline: 'border-2 border-indigo-600 active:bg-indigo-50',
  };

  const sizeStyles = {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
  };

  const textColorStyle = variant === 'outline' ? 'text-indigo-600' : 'text-white';
  const textSizeStyle = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={loading || disabled}
      className={`
        mt-2 flex-row items-center justify-center gap-2 rounded-2xl
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-60' : ''}
      `}>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#4f46e5' : 'white'} />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={size === 'sm' ? 16 : size === 'md' ? 18 : 20}
              color={variant === 'outline' ? '#4f46e5' : 'white'}
            />
          )}
          <Text className={`font-semibold ${textSizeStyle[size]} ${textColorStyle}`}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}
