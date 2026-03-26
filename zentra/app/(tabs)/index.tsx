import { useState } from 'react';
import { Pressable, ScrollView, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import {
  mockEvents, mockUser, mockNotifications,
  getPersonalizedFeed, getSmartReason, formatEventTime,
  CATEGORY_META, Event,
} from '@/store/app-store';
import { C } from '@/constants/theme';

type IName = React.ComponentProps<typeof Ionicons>['name'];

export default function HomeScreen() {
  const [events, setEvents] = useState(mockEvents);
  const feed = getPersonalizedFeed(events, mockUser);
  const unread = mockNotifications.filter(n => !n.read).length;

  const toggleInterested = (id: string) => {
    setEvents(prev => prev.map(e =>
      e.id === id
        ? { ...e, interestedByMe: !e.interestedByMe, interested: e.interestedByMe ? e.interested - 1 : e.interested + 1 }
        : e
    ));
  };

  const todayEvents = feed.filter(e => {
    const h = (new Date(e.date).getTime() - Date.now()) / 3600000;
    return h >= -1 && h <= 24;
  });
  const upcoming = feed.filter(e => {
    const h = (new Date(e.date).getTime() - Date.now()) / 3600000;
    return h > 24;
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good {getGreeting()}, {mockUser.name.split(' ')[0]}</Text>
            <Text style={styles.subGreeting}>Stay informed. Stay involved.</Text>
          </View>
          <Pressable style={styles.notifBtn} onPress={() => router.push('/(tabs)/notifications')}>
            <Ionicons name="notifications-outline" size={24} color={C.navy} />
            {unread > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unread > 9 ? '9+' : unread}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {todayEvents[0] && getSmartReason(todayEvents[0], mockUser) && (
          <Pressable style={styles.smartBanner} onPress={() => router.push(`/event/${todayEvents[0].id}`)}>
            <View style={[styles.smartIconWrap, { backgroundColor: CATEGORY_META[todayEvents[0].category].bg }]}>
              <Ionicons name={CATEGORY_META[todayEvents[0].category].iconName as IName} size={22} color={CATEGORY_META[todayEvents[0].category].color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.smartLabel}>{getSmartReason(todayEvents[0], mockUser)}</Text>
              <Text style={styles.smartTitle} numberOfLines={1}>{todayEvents[0].title}</Text>
              <Text style={styles.smartTime}>{formatEventTime(todayEvents[0].date)} · {todayEvents[0].location}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={C.navy} />
          </Pressable>
        )}

        <View style={styles.forYouRow}>
          <Text style={styles.forYouLabel}>For You</Text>
          <Text style={styles.forYouSub}>Based on your interests</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={16} color={C.navy} />
            <Text style={styles.sectionTitle}>Near You</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            {feed.slice(0, 5).map(event => (
              <NearCard key={event.id} event={event} onPress={() => router.push(`/event/${event.id}`)} />
            ))}
          </ScrollView>
        </View>

        {todayEvents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time" size={16} color={C.navy} />
              <Text style={styles.sectionTitle}>Today</Text>
            </View>
            {todayEvents.map(event => (
              <EventCard key={event.id} event={event} onPress={() => router.push(`/event/${event.id}`)} onInterested={() => toggleInterested(event.id)} />
            ))}
          </View>
        )}

        {upcoming.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="calendar" size={16} color={C.navy} />
              <Text style={styles.sectionTitle}>Upcoming</Text>
            </View>
            {upcoming.map(event => (
              <EventCard key={event.id} event={event} onPress={() => router.push(`/event/${event.id}`)} onInterested={() => toggleInterested(event.id)} />
            ))}
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function NearCard({ event, onPress }: { event: Event; onPress: () => void }) {
  const meta = CATEGORY_META[event.category];
  return (
    <Pressable style={styles.nearCard} onPress={onPress}>
      <View style={[styles.nearCatBadge, { backgroundColor: meta.bg }]}>
        <Ionicons name={meta.iconName as IName} size={18} color={meta.color} />
      </View>
      <Text style={styles.nearZone} numberOfLines={1}>{event.zone}</Text>
      <Text style={styles.nearTitle} numberOfLines={2}>{event.title}</Text>
      <Text style={[styles.nearTime, { color: meta.color }]}>{formatEventTime(event.date)}</Text>
    </Pressable>
  );
}

function EventCard({ event, onPress, onInterested }: { event: Event; onPress: () => void; onInterested: () => void }) {
  const meta = CATEGORY_META[event.category];
  return (
    <Pressable style={styles.eventCard} onPress={onPress}>
      <View style={[styles.catDot, { backgroundColor: meta.color }]} />
      <View style={{ flex: 1 }}>
        <View style={styles.eventTopRow}>
          <View style={[styles.catPill, { backgroundColor: meta.bg }]}>
            <Ionicons name={meta.iconName as IName} size={11} color={meta.color} />
            <Text style={[styles.catPillText, { color: meta.color }]}> {event.category}</Text>
          </View>
          <Text style={styles.eventTime}>{formatEventTime(event.date)}</Text>
        </View>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <View style={styles.eventLocRow}>
          <Ionicons name="location-outline" size={12} color={C.textMuted} />
          <Text style={styles.eventLocation}> {event.location}</Text>
        </View>
        <View style={styles.eventFooter}>
          <View style={styles.statRow}>
            <Ionicons name="eye-outline" size={13} color={C.textMuted} />
            <Text style={styles.eventStat}> {event.views}</Text>
          </View>
          <View style={styles.statRow}>
            <Ionicons name="star-outline" size={13} color={C.textMuted} />
            <Text style={styles.eventStat}> {event.interested}</Text>
          </View>
          <Pressable style={[styles.interestedBtn, event.interestedByMe && styles.interestedBtnActive]} onPress={onInterested}>
            <Ionicons name={event.interestedByMe ? 'star' : 'star-outline'} size={12} color={event.interestedByMe ? C.navy : C.navy} />
            <Text style={[styles.interestedText, event.interestedByMe && styles.interestedTextActive]}> Interested</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  safeHeader: { backgroundColor: C.bg, borderBottomWidth: 1, borderBottomColor: C.border },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  greeting: { fontSize: 18, fontWeight: '700', color: C.textPrimary },
  subGreeting: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  notifBtn: { padding: 8, position: 'relative', backgroundColor: C.bgCard, borderRadius: 12 },
  badge: { position: 'absolute', top: 4, right: 4, backgroundColor: '#FF4444', borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  scroll: { paddingTop: 20 },
  smartBanner: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 16, backgroundColor: C.yellowBg, borderRadius: 16, borderWidth: 1, borderColor: C.yellowBorder, padding: 14, gap: 12 },
  smartIconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  smartLabel: { fontSize: 11, color: C.navy, fontWeight: '700', marginBottom: 2 },
  smartTitle: { fontSize: 15, fontWeight: '700', color: C.textPrimary },
  smartTime: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  forYouRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 8 },
  forYouLabel: { fontSize: 15, fontWeight: '700', color: C.textPrimary },
  forYouSub: { fontSize: 11, color: C.textMuted },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: C.textPrimary },
  hScroll: { paddingLeft: 16, paddingRight: 4 },
  nearCard: { width: 140, backgroundColor: C.bgCard, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 14, marginRight: 12 },
  nearCatBadge: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  nearZone: { fontSize: 10, color: C.textMuted, marginBottom: 4 },
  nearTitle: { fontSize: 13, fontWeight: '600', color: C.textPrimary, marginBottom: 6, lineHeight: 18 },
  nearTime: { fontSize: 11, fontWeight: '600' },
  eventCard: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 12, backgroundColor: C.bgCard, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 14, gap: 10 },
  catDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  eventTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  catPill: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  catPillText: { fontSize: 11, fontWeight: '600' },
  eventTime: { fontSize: 11, color: C.textMuted },
  eventTitle: { fontSize: 15, fontWeight: '700', color: C.textPrimary, marginBottom: 4 },
  eventLocRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  eventLocation: { fontSize: 12, color: C.textMuted },
  eventFooter: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statRow: { flexDirection: 'row', alignItems: 'center' },
  eventStat: { fontSize: 12, color: C.textMuted },
  interestedBtn: { flexDirection: 'row', alignItems: 'center', marginLeft: 'auto', borderRadius: 8, borderWidth: 1, borderColor: C.border, paddingHorizontal: 10, paddingVertical: 4 },
  interestedBtnActive: { backgroundColor: C.yellow, borderColor: C.navy, borderWidth: 1 },
  interestedText: { fontSize: 12, color: C.textSecondary, fontWeight: '600' },
  interestedTextActive: { color: C.navy },
});
