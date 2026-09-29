import { Tabs } from 'expo-router';
import { Chrome as Home, Users, Bell, MessageSquare, Settings } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
          backgroundColor: colors.card,
        },
        headerStyle: {
          backgroundColor: colors.card,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTitleStyle: {
          color: colors.primary,
          fontWeight: 'bold',
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: 'Nexus',
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Friends',
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
          headerTitle: 'Friends',
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
          headerTitle: 'Notifications',
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
          headerTitle: 'Messages',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          headerTitle: 'Menu & Settings',
        }}
      />
    </Tabs>
  );
}