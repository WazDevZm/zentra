import { useState } from 'react';
import {
  Pressable, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import {
  mockEvents, CATEGORY_META, formatEventTime,
} from '@/store/app-store';
import { C } from '@/constants/theme';

type IName = React.ComponentProps<typeof Ionicons>['name'];

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [events, setEvents] = useState(mockEvents);
  const event = events.find(e => e.id === id);

  if (!event) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Event not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const meta = CATEGORY_META[event.category];

  const toggleInterested = () => {
    setEvents(prev => prev.map(e =>
      e.id === id
        ? { ...e, interestedByMe: !e.interestedByMe, interested: e.interestedByMe ? e.interested - 1 : e.interested + 1 }
        : e
    ));
  };

  const updatedEvent = events.find(e => e.id === id)!;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: meta.bg }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={C.textPrimary} />
        </Pressable>
        <View style={styles.heroIcon}>
          <Ionicons name={meta.iconName as IName} size={40} color={meta.color} />
        </View>
        <View style={[styles.heroCatBadge, { backgroundColor: meta.color }]}>
          <Text style={styles.heroCatText}>{event.category}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Title block */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.organizer}>by {event.organizer}</Text>
        </View>

        {/* Info cards */}
        <View style={styles.infoRow}>
          <InfoChip icon="calendar-outline" label="Date & Time" value={formatEventTime(event.date)} />
          <InfoChip icon="time-outline" label="Time" value={event.time} />
        </View>
        <View style={styles.infoRow}>
          <InfoChip icon="location-outline" label="Location" value={event.location} />
          <InfoChip icon="map-outline" label="Zone" value={event.zone} />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        {/* Engagement stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard icon="eye-outline" label="Views" value={updatedEvent.views} color={meta.color} />
            <StatCard icon="star-outline" label="Interested" value={updatedEvent.interested} color={meta.color} />
            <StatCard icon="people-outline" label="Est. Attendance" value={updatedEvent.attendanceEstimate} color={meta.color} />
          </View>
        </View>

        {/* Reminder note */}
        <View style={styles.reminderNote}>
          <Ionicons name="notifications-outline" size={20} color={C.navy} style={styles.reminderIcon} />
          <View>
            <Text style={styles.reminderTitle}>Smart Reminders</Text>
            <Text style={styles.reminderSub}>
              Mark as interested to get reminders 1 day and 1 hour before this event.
            </Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <Pressable
          style={[styles.intBtn, updatedEvent.interestedByMe && { backgroundColor: meta.color, borderColor: meta.color }]}
          onPress={toggleInterested}
        >
          <Text style={[styles.intBtnText, updatedEvent.interestedByMe && { color: '#1A237E' }]}>
            {updatedEvent.interestedByMe ? `Interested (${updatedEvent.interested})` : `I'm Interested`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function InfoChip({ icon, label, value }: { icon: IName; label: string; value: string }) {
  return (
    <View style={styles.infoChip}>
      <Ionicons name={icon} size={20} color={C.navy} style={styles.infoChipIcon} />
      <View>
        <Text style={styles.infoChipLabel}>{label}</Text>
        <Text style={styles.infoChipValue}>{value}</Text>
      </View>
    </View>
  );
}

function StatCard({ icon, label, value, color }: { icon: IName; label: string; value: number; color: string }) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={20} color={C.navy} style={styles.statIcon} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  notFound: { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { color: C.textPrimary, fontSize: 18, marginBottom: 12 },
  backLink: { color: C.navy, fontSize: 15 },
  hero: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    top: 74,
    left: 16,
    width: 40, height: 40,
    borderRadius: 12,
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIcon: {
    width: 80, height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroIconText: { fontSize: 40 },
  heroCatBadge: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  heroCatText: { color: C.navy, fontSize: 13, fontWeight: '700' },
  scroll: { paddingHorizontal: 20, paddingTop: 24 },
  titleBlock: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', color: C.textPrimary, marginBottom: 4 },
  organizer: { fontSize: 13, color: C.textMuted },
  infoRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  infoChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 12,
  },
  infoChipIcon: {},
  infoChipLabel: { fontSize: 10, color: C.textMuted, marginBottom: 2 },
  infoChipValue: { fontSize: 13, fontWeight: '600', color: C.textPrimary },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: C.textPrimary, marginBottom: 10 },
  description: { fontSize: 14, color: C.textSecondary, lineHeight: 22 },
  statsGrid: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: C.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
    alignItems: 'center',
  },
  statIcon: { marginBottom: 6 },
  statValue: { fontSize: 22, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 11, color: C.textMuted, textAlign: 'center' },
  reminderNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(255,235,59,0.09)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,235,59,0.22)',
    padding: 14,
    marginBottom: 16,
  },
  reminderIcon: { marginTop: 1 },
  reminderTitle: { fontSize: 14, fontWeight: '700', color: C.textPrimary, marginBottom: 3 },
  reminderSub: { fontSize: 12, color: C.textSecondary, lineHeight: 18 },
  bottomBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: C.bg,
    borderTopWidth: 1,
    borderTopColor: C.border,
    padding: 16,
    paddingBottom: 32,
  },
  intBtn: {
    borderRadius: 14,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFEB3B',
  },
  intBtnText: { fontSize: 16, fontWeight: '800', color: C.navy },
});
