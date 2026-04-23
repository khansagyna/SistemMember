import { TextInput, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  keyboardType?: "default" | "email-address" | "phone-pad" | "number-pad";
  error?: string;
}

export default function Input({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  label,
  icon,
  keyboardType = "default",
  error,
}: InputProps) {
  return (
    <View className="mb-5">
      {label && (
        <Text className="text-slate-700 mb-2 font-semibold text-base">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center bg-gradient-to-r from-slate-50 to-slate-100 border-2 rounded-2xl px-4 py-3 ${error ? "border-red-400" : "border-slate-200"
          }`}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error ? "#f87171" : "#64748b"}
            style={{ marginRight: 10 }}
          />
        )}
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          className="flex-1 text-slate-800 font-medium text-base"
          placeholderTextColor="#94a3b8"
        />
      </View>
      {error && (
        <Text className="text-red-500 font-medium text-sm mt-2">{error}</Text>
      )}
    </View>
  );
}
