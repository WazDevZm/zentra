import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { mockNotifications, CATEGORY_META, Notification } from '@/store/app-store';

type IName = React.ComponentProps<typeof Ionicons>['name'];

export default function NotificationsScreen() {
  const [notifs, setNotifs] = useState(mockNotifications);

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const unread = notifs.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unread > 0 && <Text style={styles.headerSub}>{unread} unread</Text>}
        </View>
        {unread > 0 && (
          <Pressable onPress={markAllRead} style={styles.markAllBtn}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </Pressable>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {notifs.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        ) : (
          notifs.map(notif => (
            <NotifCard
              key={notif.id}
              notif={notif}
              onPress={() => {
                markRead(notif.id);
                if (notif.eventId) router.push(`/event/${notif.eventId}`);
              }}
            />
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function NotifCard({ notif, onPress }: { notif: Notification; onPress: () => void }) {
  const meta = CATEGORY_META[notif.category];
  return (
    <Pressable
      style={[styles.card, !notif.read && styles.cardUnread]}
      onPress={onPress}
    >
      {!notif.read && <View style={[styles.unreadDot, { backgroundColor: meta.color }]} />}
      <View style={[styles.iconWrap, { backgroundColor: meta.bg }]}>
        <Ionicons name={meta.iconName as IName} size={20} color={meta.color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.notifTitle}>{notif.title}</Text>
        <Text style={styles.notifBody} numberOfLines={2}>{notif.body}</Text>
        <View style={styles.notifMeta}>
          <View style={[styles.catPill, { backgroundColor: meta.bg }]}>
            <Text style={[styles.catPillText, { color: meta.color }]}>{notif.category}</Text>
          </View>
          <Text style={styles.notifTime}>{notif.time}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A237E' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#283593',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,235,59,0.12)',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 12, color: '#FFEB3B', marginTop: 2 },
  markAllBtn: {
    borderRadius: 10, borderWidth: 1,
    borderColor: 'rgba(255,235,59,0.35)',
    paddingHorizontal: 12, paddingVertical: 6,
  },
  markAllText: { fontSize: 12, color: '#FFEB3B', fontWeight: '600' },
  scroll: { padding: 16 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 16, color: 'rgba(255,255,255,0.4)' },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: 14,
    marginBottom: 10,
    position: 'relative',
  },
  cardUnread: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderColor: 'rgba(255,255,255,0.12)',
  },
  unreadDot: {
    position: 'absolute',
    top: 14, left: 8,
    width: 6, height: 6, borderRadius: 3,
  },
  iconWrap: {
    width: 42, height: 42, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  icon: { fontSize: 20 },
  notifTitle: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 3 },
  notifBody: { fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 18, marginBottom: 8 },
  notifMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catPill: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  catPillText: { fontSize: 11, fontWeight: '600' },
  notifTime: { fontSize: 11, color: 'rgba(255,255,255,0.35)' },
});
