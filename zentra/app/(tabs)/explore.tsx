import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { mockEvents, CATEGORY_META, formatEventTime, Event, Category } from '@/store/app-store';
import { C } from '@/constants/theme';

type IName = React.ComponentProps<typeof Ionicons>['name'];
const ALL_CATS: Category[] = ['Church', 'Academic', 'Social', 'Sports', 'Tech'];

export default function ExploreScreen() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Category | null>(null);
  const [events, setEvents] = useState(mockEvents);

  const filtered = events
    .filter(e => new Date(e.date).getTime() >= Date.now() - 3600000)
    .filter(e => !selected || e.category === selected)
    .filter(e => !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const toggleInterested = (id: string) => {
    setEvents(prev => prev.map(e =>
      e.id === id ? { ...e, interestedByMe: !e.interestedByMe, interested: e.interestedByMe ? e.interested - 1 : e.interested + 1 } : e
    ));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Explore Events</Text>
            <Text style={styles.headerSub}>Find what&apos;s happening on campus</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="compass-outline" size={22} color={C.yellow} />
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={C.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search events or locations..."
          placeholderTextColor="rgba(255,255,255,0.3)"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={C.textMuted} />
          </Pressable>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
        <Pressable style={[styles.filterChip, !selected && styles.filterChipActive]} onPress={() => setSelected(null)}>
          <Text style={[styles.filterText, !selected && styles.filterTextActive]}>All</Text>
        </Pressable>
        {ALL_CATS.map(cat => {
          const meta = CATEGORY_META[cat];
          const active = selected === cat;
          return (
            <Pressable
              key={cat}
              style={[styles.filterChip, active && { backgroundColor: meta.color, borderColor: meta.color }]}
              onPress={() => setSelected(active ? null : cat)}
            >
              <Ionicons name={meta.iconName as IName} size={13} color={active ? C.bg : meta.color} />
              <Text style={[styles.filterText, active && { color: C.bg }]}> {cat}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={styles.resultCount}>{filtered.length} event{filtered.length !== 1 ? 's' : ''} found</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="search" size={48} color={C.textMuted} />
            <Text style={styles.emptyText}>No events found</Text>
            <Text style={styles.emptySubText}>Try a different search or category</Text>
          </View>
        ) : (
          filtered.map(event => (
            <ExploreCard
              key={event.id}
              event={event}
              onPress={() => router.push(`/event/${event.id}`)}
              onInterested={() => toggleInterested(event.id)}
            />
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function ExploreCard({ event, onPress, onInterested }: { event: Event; onPress: () => void; onInterested: () => void }) {
  const meta = CATEGORY_META[event.category];
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {event.imageUrl ? (
        <Image source={{ uri: event.imageUrl }} style={styles.cardImage} />
      ) : (
        <View style={[styles.cardImagePlaceholder, { backgroundColor: meta.bg }]}>
          <Ionicons name={meta.iconName as IName} size={32} color={meta.color} />
        </View>
      )}
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <View style={[styles.catBadge, { backgroundColor: meta.bg }]}>
            <Ionicons name={meta.iconName as IName} size={11} color={meta.color} />
            <Text style={[styles.catBadgeText, { color: meta.color }]}> {event.category}</Text>
          </View>
          <Text style={styles.cardTime}>{formatEventTime(event.date)}</Text>
        </View>
        <Text style={styles.cardTitle}>{event.title}</Text>
        <Text style={styles.cardOrg}>by {event.organizer}</Text>
        <View style={styles.cardLocRow}>
          <Ionicons name="location-outline" size={12} color={C.textMuted} />
          <Text style={styles.cardLoc}> {event.location} · {event.zone}</Text>
        </View>
        <Text style={styles.cardDesc} numberOfLines={2}>{event.description}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={13} color={C.textMuted} />
              <Text style={styles.stat}> {event.views}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="star-outline" size={13} color={C.textMuted} />
              <Text style={styles.stat}> {event.interested}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={13} color={C.textMuted} />
              <Text style={styles.stat}> ~{event.attendanceEstimate}</Text>
            </View>
          </View>
          <Pressable style={[styles.intBtn, event.interestedByMe && styles.intBtnActive]} onPress={onInterested}>
            <Ionicons name={event.interestedByMe ? 'star' : 'star-outline'} size={12} color={event.interestedByMe ? C.bg : C.yellow} />
            <Text style={[styles.intText, event.interestedByMe && styles.intTextActive]}> Interested</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  safeHeader: { backgroundColor: C.bgCard, borderBottomWidth: 1, borderBottomColor: C.yellowBorder },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: C.textPrimary },
  headerSub: { fontSize: 12, color: C.textSecondary, marginTop: 2 },
  headerIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.yellowBg, alignItems: 'center', justifyContent: 'center' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', margin: 16, backgroundColor: C.bgSurface, borderRadius: 14, borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, height: 48, gap: 8 },
  searchInput: { flex: 1, color: C.textPrimary, fontSize: 14 },
  filterRow: { marginBottom: 8 },
  filterContent: { paddingHorizontal: 16, gap: 8 },
  filterChip: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: C.bgSurface },
  filterChipActive: { backgroundColor: C.yellow, borderColor: C.yellow },
  filterText: { fontSize: 13, color: C.textSecondary, fontWeight: '500' },
  filterTextActive: { color: C.bg, fontWeight: '700' },
  resultCount: { fontSize: 12, color: C.textMuted, paddingHorizontal: 16, marginBottom: 8 },
  list: { paddingHorizontal: 16, paddingTop: 4 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyText: { fontSize: 16, fontWeight: '600', color: C.textSecondary },
  emptySubText: { fontSize: 13, color: C.textMuted },
  card: { backgroundColor: C.bgCard, borderRadius: 16, borderWidth: 1, borderColor: C.border, marginBottom: 16, overflow: 'hidden' },
  cardImage: { width: '100%', height: 160 },
  cardImagePlaceholder: { width: '100%', height: 120, alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: 14 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  catBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  catBadgeText: { fontSize: 11, fontWeight: '600' },
  cardTime: { fontSize: 11, color: C.textSecondary },
  cardTitle: { fontSize: 16, fontWeight: '700', color: C.textPrimary, marginBottom: 2 },
  cardOrg: { fontSize: 12, color: C.textMuted, marginBottom: 4 },
  cardLocRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  cardLoc: { fontSize: 12, color: C.textSecondary },
  cardDesc: { fontSize: 13, color: C.textSecondary, lineHeight: 18, marginBottom: 10 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statItem: { flexDirection: 'row', alignItems: 'center' },
  stat: { fontSize: 12, color: C.textMuted },
  intBtn: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: C.yellowBorder, paddingHorizontal: 10, paddingVertical: 4 },
  intBtnActive: { backgroundColor: C.yellow, borderColor: C.yellow },
  intText: { fontSize: 12, color: C.yellow, fontWeight: '600' },
  intTextActive: { color: C.bg },
});
