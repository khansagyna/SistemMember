import { TextInput, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
  error?: string;
}

export default function Input({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  label,
  icon,
  keyboardType = 'default',
  error,
}: InputProps) {
  return (
    <View className="mb-5">
      {label && <Text className="mb-2 text-base font-semibold text-slate-700">{label}</Text>}
      <View
        className={`flex-row items-center rounded-2xl border-2 bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 ${
          error ? 'border-red-400' : 'border-slate-200'
        }`}>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error ? '#f87171' : '#64748b'}
            style={{ marginRight: 10 }}
          />
        )}
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          className="flex-1 text-base font-medium text-slate-800"
          placeholderTextColor="#94a3b8"
        />
      </View>
      {error && <Text className="mt-2 text-sm font-medium text-red-500">{error}</Text>}
    </View>
  );
}
