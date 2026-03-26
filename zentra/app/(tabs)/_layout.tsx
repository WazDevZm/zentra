import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HapticTab } from '@/components/haptic-tab';
import { mockNotifications } from '@/store/app-store';

const unreadCount = mockNotifications.filter(n => !n.read).length;

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({
  name,
  focused,
  color,
  badge,
}: {
  name: IoniconsName;
  focused: boolean;
  color: string;
  badge?: number;
}) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons name={name} size={22} color={color} />
      {!!badge && badge > 0 && (
        <View style={styles.badge}>
          <Ionicons name="ellipse" size={16} color="#FF4444" style={styles.badgeDot} />
        </View>
      )}
    </View>
  );
}

function CreateTabIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[styles.createBtn, focused && styles.createBtnActive]}>
      <Ionicons name="add" size={28} color="#1A237E" />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#FFEB3B',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Discover',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'search' : 'search-outline'} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Post',
          tabBarIcon: ({ focused }) => <CreateTabIcon focused={focused} />,
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              name={focused ? 'notifications' : 'notifications-outline'}
              focused={focused}
              color={color}
              badge={unreadCount}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#283593',
    borderTopColor: 'rgba(255,235,59,0.15)',
    borderTopWidth: 1,
    height: 82,
    paddingBottom: 18,
    paddingTop: 6,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  iconWrap: {
    width: 42,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(255,235,59,0.14)',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  badgeDot: {
    shadowColor: '#FF4444',
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  createBtn: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#FFEB3B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  createBtnActive: {
    backgroundColor: '#F9D800',
  },
});
