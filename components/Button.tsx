import { Pressable, Text, ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "success" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  fullWidth = true,
}: ButtonProps) {
  const variantStyles = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 active:opacity-90",
    secondary: "bg-gradient-to-r from-slate-200 to-slate-300 active:opacity-90",
    danger: "bg-gradient-to-r from-red-500 to-red-600 active:opacity-90",
    success: "bg-gradient-to-r from-green-500 to-green-600 active:opacity-90",
    outline: "border-2 border-blue-600 active:opacity-75",
  };

  const sizeStyles = {
    sm: "px-4 py-2",
    md: "px-6 py-3",
    lg: "px-8 py-4",
  };

  const textColorStyle = variant === "outline" ? "text-blue-600" : "text-white";
  const textSizeStyle = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={loading || disabled}
      className={`
        flex-row items-center justify-center rounded-2xl mt-2 gap-2
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-60" : ""}
      `}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? "#2563eb" : "white"} />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={size === "sm" ? 16 : size === "md" ? 18 : 20}
              color={variant === "outline" ? "#2563eb" : "white"}
            />
          )}
          <Text
            className={`font-semibold ${textSizeStyle[size]} ${textColorStyle}`}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}
