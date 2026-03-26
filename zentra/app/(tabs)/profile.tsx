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
import { C } from '@/constants/theme';

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
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Pressable style={styles.settingsBtn}>
          <Ionicons name="settings-outline" size={22} color={C.navy} />
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
                  <Ionicons name={meta.iconName as IName} size={15} color={active ? meta.color : C.textMuted} />
                  <Text style={[styles.interestLabel, active && { color: meta.color }]}>{cat}</Text>
                  {active && <Text style={[styles.interestCheck, { color: meta.color }]}>✓</Text>}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Saved / Interested events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Events</Text>
          {savedEvents.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="bookmark-outline" size={32} color={C.textMuted} style={styles.emptyIcon} />
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
                  <Ionicons name="chevron-forward" size={18} color={C.textMuted} style={styles.savedArrow} />
                </Pressable>
              );
            })
          )}
        </View>

        {/* Settings list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {[
            { icon: 'notifications-outline' as IName, label: 'Notification Preferences' },
            { icon: 'lock-closed-outline' as IName, label: 'Privacy & Security' },
            { icon: 'help-circle-outline' as IName, label: 'Help & Support' },
            { icon: 'document-text-outline' as IName, label: 'Terms of Service' },
          ].map(item => (
            <Pressable key={item.label} style={styles.settingsRow}>
              <Ionicons name={item.icon} size={18} color={C.navy} style={styles.settingsRowIcon} />
              <Text style={styles.settingsRowLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={C.textMuted} style={styles.settingsRowArrow} />
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
  container: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 68,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: C.bg,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: C.textPrimary },
  settingsBtn: { padding: 4 },
  scroll: { paddingTop: 24 },

  profileCard: {
    marginHorizontal: 20,
    backgroundColor: C.bgCard,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: C.border,
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
  name: { fontSize: 20, fontWeight: '800', color: C.textPrimary, marginBottom: 4 },
  email: { fontSize: 13, color: C.textMuted, marginBottom: 20 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 0 },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '800', color: C.navy },
  statLbl: { fontSize: 11, color: C.textMuted, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: C.border },

  section: { marginHorizontal: 20, marginBottom: 28 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: C.textPrimary, marginBottom: 4 },
  sectionSub: { fontSize: 12, color: C.textMuted, marginBottom: 14 },

  interestGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  interestChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 20, borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.bgCard,
    paddingHorizontal: 14, paddingVertical: 9,
  },
  interestIcon: { fontSize: 15 },
  interestLabel: { fontSize: 13, fontWeight: '600', color: C.textSecondary },
  interestCheck: { fontSize: 12, fontWeight: '800', marginLeft: 2 },

  emptyCard: {
    backgroundColor: C.bgCard,
    borderRadius: 16, borderWidth: 1,
    borderColor: C.border,
    padding: 24, alignItems: 'center',
  },
  emptyIcon: { marginBottom: 8 },
  emptyText: { fontSize: 14, fontWeight: '600', color: C.textSecondary, marginBottom: 4 },
  emptySub: { fontSize: 12, color: C.textMuted, textAlign: 'center' },

  savedCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: C.bgCard,
    borderRadius: 14, borderWidth: 1,
    borderColor: C.border,
    marginBottom: 10, overflow: 'hidden',
  },
  savedAccent: { width: 4, alignSelf: 'stretch' },
  savedIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  savedIcon: { fontSize: 18 },
  savedTitle: { fontSize: 14, fontWeight: '700', color: C.textPrimary, marginBottom: 3 },
  savedMeta: { fontSize: 12, color: C.textMuted },
  savedArrow: { paddingRight: 14 },

  settingsRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: C.bgCard,
    borderRadius: 14, borderWidth: 1,
    borderColor: C.border,
    padding: 14, marginBottom: 8,
  },
  settingsRowIcon: {},
  settingsRowLabel: { flex: 1, fontSize: 14, color: C.textSecondary, fontWeight: '500' },
  settingsRowArrow: {},

  signOutBtn: {
    marginHorizontal: 20,
    borderRadius: 14, borderWidth: 1,
    borderColor: 'rgba(255,80,80,0.4)',
    height: 52, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,80,80,0.08)',
  },
  signOutText: { color: '#FF6B6B', fontSize: 15, fontWeight: '700' },
});
