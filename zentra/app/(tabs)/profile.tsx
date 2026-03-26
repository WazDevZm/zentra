import { useState } from 'react';
import {
  Pressable, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import {
  mockUser, mockEvents, CATEGORY_META, Category, formatEventTime,
} from '@/store/app-store';

const ALL_CATS: Category[] = ['Church', 'Academic', 'Social', 'Sports', 'Tech'];
type IName = React.ComponentProps<typeof Ionicons>['name'];

export default function ProfileScreen() {
  const [interests, setInterests] = useState<Category[]>(mockUser.interests);
  const savedEvents = mockEvents.filter(e => e.interestedByMe);

  const toggleInterest = (cat: Category) => {
    setInterests(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Pressable style={styles.settingsBtn}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Avatar + info */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>
              {mockUser.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <Text style={styles.name}>{mockUser.name}</Text>
          <Text style={styles.email}>{mockUser.email}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{savedEvents.length}</Text>
              <Text style={styles.statLbl}>Interested</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{mockUser.pastCategories.length}</Text>
              <Text style={styles.statLbl}>Attended</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{interests.length}</Text>
              <Text style={styles.statLbl}>Interests</Text>
            </View>
          </View>
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Interests</Text>
          <Text style={styles.sectionSub}>Tap to toggle — this shapes your feed</Text>
          <View style={styles.interestGrid}>
            {ALL_CATS.map(cat => {
              const meta = CATEGORY_META[cat];
              const active = interests.includes(cat);
              return (
                <Pressable
                  key={cat}
                  style={[styles.interestChip, active && { backgroundColor: meta.bg, borderColor: meta.color }]}
                  onPress={() => toggleInterest(cat)}
                >
                  <Ionicons name={meta.iconName as IName} size={15} color={active ? meta.color : 'rgba(255,255,255,0.7)'} />
                  <Text style={[styles.interestLabel, active && { color: meta.color }]}>{cat}</Text>
                  {active && <Text style={[styles.interestCheck, { color: meta.color }]}>✓</Text>}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Saved / Interested events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⭐ Saved Events</Text>
          {savedEvents.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>No saved events yet</Text>
              <Text style={styles.emptySub}>Tap &quot;Interested&quot; on any event to save it here</Text>
            </View>
          ) : (
            savedEvents.map(event => {
              const meta = CATEGORY_META[event.category];
              return (
                <Pressable
                  key={event.id}
                  style={styles.savedCard}
                  onPress={() => router.push(`/event/${event.id}`)}
                >
                  <View style={[styles.savedAccent, { backgroundColor: meta.color }]} />
                  <View style={[styles.savedIconWrap, { backgroundColor: meta.bg }]}>
                    <Ionicons name={meta.iconName as IName} size={18} color={meta.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.savedTitle}>{event.title}</Text>
                    <Text style={styles.savedMeta}>
                      {formatEventTime(event.date)} · {event.location}
                    </Text>
                  </View>
                  <Text style={styles.savedArrow}>›</Text>
                </Pressable>
              );
            })
          )}
        </View>

        {/* Settings list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {[
            { icon: '🔔', label: 'Notification Preferences' },
            { icon: '🔒', label: 'Privacy & Security' },
            { icon: '❓', label: 'Help & Support' },
            { icon: '📋', label: 'Terms of Service' },
          ].map(item => (
            <Pressable key={item.label} style={styles.settingsRow}>
              <Text style={styles.settingsRowIcon}>{item.icon}</Text>
              <Text style={styles.settingsRowLabel}>{item.label}</Text>
              <Text style={styles.settingsRowArrow}>›</Text>
            </Pressable>
          ))}
        </View>

        {/* Sign out */}
        <Pressable
          style={styles.signOutBtn}
          onPress={() => router.replace('/sign-in')}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
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
  settingsBtn: { padding: 4 },
  settingsIcon: { fontSize: 22 },
  scroll: { paddingTop: 20 },

  profileCard: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#FFEB3B',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 28, fontWeight: '800', color: '#1A237E' },
  name: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 4 },
  email: { fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 20 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 0 },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '800', color: '#FFEB3B' },
  statLbl: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.1)' },

  section: { marginHorizontal: 20, marginBottom: 28 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 4 },
  sectionSub: { fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 14 },

  interestGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  interestChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 20, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 14, paddingVertical: 9,
  },
  interestIcon: { fontSize: 15 },
  interestLabel: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.7)' },
  interestCheck: { fontSize: 12, fontWeight: '800', marginLeft: 2 },

  emptyCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: 24, alignItems: 'center',
  },
  emptyIcon: { fontSize: 32, marginBottom: 8 },
  emptyText: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.5)', marginBottom: 4 },
  emptySub: { fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center' },

  savedCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 10, overflow: 'hidden',
  },
  savedAccent: { width: 4, alignSelf: 'stretch' },
  savedIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  savedIcon: { fontSize: 18 },
  savedTitle: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 3 },
  savedMeta: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  savedArrow: { fontSize: 22, color: 'rgba(255,255,255,0.25)', paddingRight: 14 },

  settingsRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: 14, marginBottom: 8,
  },
  settingsRowIcon: { fontSize: 18 },
  settingsRowLabel: { flex: 1, fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  settingsRowArrow: { fontSize: 20, color: 'rgba(255,255,255,0.2)' },

  signOutBtn: {
    marginHorizontal: 20,
    borderRadius: 14, borderWidth: 1,
    borderColor: 'rgba(255,80,80,0.4)',
    height: 52, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,80,80,0.08)',
  },
  signOutText: { color: '#FF6B6B', fontSize: 15, fontWeight: '700' },
});
