import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { House, Receipt, Users, Gift } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: '#94a3b8',

        tabBarLabelStyle: {
          fontFamily: 'Inter_500Medium',
          fontSize: 11,
          marginBottom: 6,
        },

        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 24,
          height: 74,
          backgroundColor: '#fff',
          borderTopWidth: 0,
          borderRadius: 24,
          paddingTop: 8,
          marginLeft: 20,
          marginRight: 20,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: {
            width: 0,
            height: 4,
          },
        },

        tabBarIcon: ({ focused, color }) => {
          const activeColor = '#4f46e5';

          const iconProps = {
            size: 20,
            color: focused ? activeColor : color,
            strokeWidth: focused ? 2.5 : 2,
          };

          let Icon = House;

          if (route.name === 'dashboard') {
            Icon = House;
          }

          if (route.name === 'transaction') {
            Icon = Receipt;
          }

          if (route.name === 'member') {
            Icon = Users;
          }

          if (route.name === 'promo') {
            Icon = Gift;
          }

          if (focused) {
            return (
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 16,
                  backgroundColor: '#eef2ff',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon {...iconProps} />
              </View>
            );
          }

          return <Icon {...iconProps} />;
        },
      })}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
        }}
      />

      <Tabs.Screen
        name="transaction"
        options={{
          title: 'Transaksi',
        }}
      />

      <Tabs.Screen
        name="member"
        options={{
          title: 'Member',
        }}
      />

      <Tabs.Screen
        name="promo"
        options={{
          title: 'Promo',
        }}
      />
    </Tabs>
  );
}
