import { Pressable, Text } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
}

export default function Button({
  title,
  onPress,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-red-500 p-4 rounded-xl mt-2 active:opacity-80"
    >
      <Text className="text-white text-center font-semibold text-lg">
        {title}
      </Text>
    </Pressable>
  );
}
