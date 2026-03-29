import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HapticTab } from '@/components/haptic-tab';
import { mockNotifications } from '@/store/app-store';
import { C } from '@/constants/theme';

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
      <Ionicons name={name} size={19} color={color} />
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
      <Ionicons name="add" size={23} color="#1A237E" />
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
        tabBarActiveTintColor: C.yellow,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
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
    backgroundColor: '#1A237E',
    borderTopWidth: 0,
    height: 76,
    paddingBottom: 12,
    paddingTop: 8,
    borderRadius: 0,
    elevation: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
  },
  tabItem: {
    paddingVertical: 2,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 1,
  },
  iconWrap: {
    width: 36,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrapActive: {
    backgroundColor: C.yellowBg,
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
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: C.yellow,
    borderWidth: 1,
    borderColor: '#1A237E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  createBtnActive: {
    backgroundColor: '#F9D800',
  },
});
