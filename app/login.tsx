import {
  View,
  Text,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Input from "@/components/Input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password)
      return alert("Isi email dan password");

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) return alert(error.message);

    router.replace("/(tabs)/dashboard");
  };

  return (
    <LinearGradient
      colors={["#1C4D8D", "#1e293b"]}
      className="flex-1 justify-center px-6"
    >
      <KeyboardAvoidingView behavior="padding">
        
        {/* GLASS CARD */}
        <View className="bg-white/90 backdrop-blur-md rounded-[36px] p-8 shadow-2xl">

          {/* TITLE */}
          <Text className="text-4xl font-bold text-gray-900 mb-2">
            Sistem Member
          </Text>

          <Text className="text-gray-500 mb-10 text-base">
            Kelola member dengan mudah & cepat
          </Text>

          {/* EMAIL */}
          <Text className="text-gray-700 mb-2 font-medium">
            Email
          </Text>

          <Input
            placeholder="email@example.com"
            value={email}
            onChangeText={setEmail}
          />

          {/* PASSWORD */}
          <Text className="text-gray-700 mt-6 mb-2 font-medium">
            Password
          </Text>

          <View className="relative">
            <Input
              placeholder="Masukkan password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4"
            >
              <Text className="text-gray-500 font-medium">
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* BUTTON */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className={`mt-8 py-4 rounded-2xl items-center ${
              loading ? "bg-gray-400" : "bg-[#213448]"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-lg">
                Login
              </Text>
            )}
          </TouchableOpacity>

        </View>

      </KeyboardAvoidingView>
    </LinearGradient>
  );
}