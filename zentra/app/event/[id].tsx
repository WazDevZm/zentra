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
          <Text style={styles.backLink}>← Go back</Text>
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
      <StatusBar style="light" />

      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: meta.bg }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>‹</Text>
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
          <InfoChip icon="📅" label="Date & Time" value={formatEventTime(event.date)} />
          <InfoChip icon="⏰" label="Time" value={event.time} />
        </View>
        <View style={styles.infoRow}>
          <InfoChip icon="📍" label="Location" value={event.location} />
          <InfoChip icon="🗺" label="Zone" value={event.zone} />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        {/* Engagement stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Event Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard icon="👁" label="Views" value={updatedEvent.views} color={meta.color} />
            <StatCard icon="⭐" label="Interested" value={updatedEvent.interested} color={meta.color} />
            <StatCard icon="👥" label="Est. Attendance" value={updatedEvent.attendanceEstimate} color={meta.color} />
          </View>
        </View>

        {/* Reminder note */}
        <View style={styles.reminderNote}>
          <Text style={styles.reminderIcon}>⏰</Text>
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
            {updatedEvent.interestedByMe ? `★ Interested (${updatedEvent.interested})` : `☆ I'm Interested`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function InfoChip({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoChip}>
      <Text style={styles.infoChipIcon}>{icon}</Text>
      <View>
        <Text style={styles.infoChipLabel}>{label}</Text>
        <Text style={styles.infoChipValue}>{value}</Text>
      </View>
    </View>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A237E' },
  notFound: { flex: 1, backgroundColor: '#1A237E', alignItems: 'center', justifyContent: 'center' },
  notFoundText: { color: '#fff', fontSize: 18, marginBottom: 12 },
  backLink: { color: '#FFEB3B', fontSize: 15 },
  hero: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: 16,
    width: 40, height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: { color: '#fff', fontSize: 24, lineHeight: 28 },
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
  heroCatText: { color: '#1A237E', fontSize: 13, fontWeight: '700' },
  scroll: { paddingHorizontal: 20, paddingTop: 20 },
  titleBlock: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 },
  organizer: { fontSize: 13, color: 'rgba(255,255,255,0.45)' },
  infoRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  infoChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 12,
  },
  infoChipIcon: { fontSize: 20 },
  infoChipLabel: { fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 2 },
  infoChipValue: { fontSize: 13, fontWeight: '600', color: '#fff' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 10 },
  description: { fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 22 },
  statsGrid: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 14,
    alignItems: 'center',
  },
  statIcon: { fontSize: 20, marginBottom: 6 },
  statValue: { fontSize: 22, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center' },
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
  reminderIcon: { fontSize: 22 },
  reminderTitle: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 3 },
  reminderSub: { fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 18 },
  bottomBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: '#283593',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.10)',
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
  intBtnText: { fontSize: 16, fontWeight: '800', color: '#FFEB3B' },
});
