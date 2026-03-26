import { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORY_META, Category, Event, formatEventTime, mockEvents } from '@/store/app-store';
import { C } from '@/constants/theme';

type IName = React.ComponentProps<typeof Ionicons>['name'];
const ALL_CATS: Category[] = ['Church', 'Academic', 'Social', 'Sports', 'Tech'];

export default function ExploreScreen() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Category | null>(null);
  const [events, setEvents] = useState(mockEvents);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events
      .filter(e => new Date(e.date).getTime() >= Date.now() - 3600000)
      .filter(e => !selected || e.category === selected)
      .filter(e => {
        if (!q) return true;
        return e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q);
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, selected, search]);

  const toggleInterested = (id: string) => {
    setEvents(prev =>
      prev.map(e =>
        e.id === id
          ? {
              ...e,
              interestedByMe: !e.interestedByMe,
              interested: e.interestedByMe ? e.interested - 1 : e.interested + 1,
            }
          : e
      )
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.headerRow}>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Explore Events</Text>
            <Text style={styles.headerSub}>Find what is happening on campus</Text>
          </View>
          <View style={styles.headerIconWrap}>
            <Ionicons name="compass-outline" size={20} color={C.navy} />
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={C.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search events or locations"
          placeholderTextColor={C.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={C.textMuted} />
          </Pressable>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContent}
        style={styles.filterRow}
      >
        <FilterChip
          label="All"
          icon="apps-outline"
          active={!selected}
          onPress={() => setSelected(null)}
        />
        {ALL_CATS.map(cat => {
          const meta = CATEGORY_META[cat];
          return (
            <FilterChip
              key={cat}
              label={cat}
              icon={meta.iconName as IName}
              active={selected === cat}
              onPress={() => setSelected(selected === cat ? null : cat)}
            />
          );
        })}
      </ScrollView>

      <Text style={styles.resultCount}>
        {filtered.length} event{filtered.length !== 1 ? 's' : ''} found
      </Text>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ExploreCard
            event={item}
            onPress={() => router.push(`/event/${item.id}`)}
            onInterested={() => toggleInterested(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search" size={44} color={C.textMuted} />
            <Text style={styles.emptyTitle}>No events found</Text>
            <Text style={styles.emptySub}>Try a different search or category</Text>
          </View>
        }
      />
    </View>
  );
}

function FilterChip({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: IName;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.filterChip, active && styles.filterChipActive]} onPress={onPress}>
      <Ionicons name={icon} size={13} color={active ? C.navy : C.textMuted} />
      <Text numberOfLines={1} style={[styles.filterText, active && styles.filterTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function ExploreCard({
  event,
  onPress,
  onInterested,
}: {
  event: Event;
  onPress: () => void;
  onInterested: () => void;
}) {
  const meta = CATEGORY_META[event.category];

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {event.imageUrl ? (
        <Image source={{ uri: event.imageUrl }} style={styles.cardImage} />
      ) : (
        <View style={[styles.cardImageFallback, { backgroundColor: meta.bg }]}> 
          <Ionicons name={meta.iconName as IName} size={30} color={meta.color} />
        </View>
      )}

      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <View style={[styles.categoryBadge, { backgroundColor: meta.bg }]}> 
            <Ionicons name={meta.iconName as IName} size={11} color={meta.color} />
            <Text style={[styles.categoryBadgeText, { color: meta.color }]}>{event.category}</Text>
          </View>
          <Text style={styles.cardTime}>{formatEventTime(event.date)}</Text>
        </View>

        <Text style={styles.cardTitle} numberOfLines={2}>
          {event.title}
        </Text>

        <Text style={styles.cardOrg} numberOfLines={1}>
          by {event.organizer}
        </Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={12} color={C.textMuted} />
          <Text style={styles.locationText} numberOfLines={1}>
            {event.location} - {event.zone}
          </Text>
        </View>

        <Text style={styles.cardDesc} numberOfLines={2}>
          {event.description}
        </Text>

        <View style={styles.footerRow}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={13} color={C.textMuted} />
              <Text style={styles.statText}>{event.views}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="star-outline" size={13} color={C.textMuted} />
              <Text style={styles.statText}>{event.interested}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={13} color={C.textMuted} />
              <Text style={styles.statText}>~{event.attendanceEstimate}</Text>
            </View>
          </View>

          <Pressable style={[styles.interestedBtn, event.interestedByMe && styles.interestedBtnActive]} onPress={onInterested}>
            <Ionicons
              name={event.interestedByMe ? 'star' : 'star-outline'}
              size={12}
              color={event.interestedByMe ? C.bg : C.navy}
            />
            <Text style={[styles.interestedText, event.interestedByMe && styles.interestedTextActive]}>
              Interested
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  safeHeader: {
    backgroundColor: C.bg,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 28,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: C.textPrimary,
  },
  headerSub: {
    marginTop: 2,
    fontSize: 12,
    color: C.textSecondary,
  },
  headerIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: C.yellowBg,
    borderWidth: 1,
    borderColor: C.yellowBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: {
    marginTop: 10,
    marginBottom: 8,
    marginHorizontal: 14,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.bgSurface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: C.textPrimary,
  },
  filterRow: {
    marginBottom: 6,
  },
  filterContent: {
    paddingHorizontal: 14,
    gap: 6,
    paddingBottom: 2,
  },
  filterChip: {
    minHeight: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.bgSurface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: C.yellow,
    borderColor: C.navy,
  },
  filterText: {
    fontSize: 11,
    lineHeight: 14,
    color: C.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: C.navy,
    fontWeight: '700',
  },
  resultCount: {
    paddingHorizontal: 14,
    marginBottom: 8,
    fontSize: 12,
    color: C.textMuted,
  },
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 64,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: C.textSecondary,
  },
  emptySub: {
    fontSize: 13,
    color: C.textMuted,
  },
  card: {
    marginBottom: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.bgCard,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardImageFallback: {
    width: '100%',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    padding: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardTime: {
    fontSize: 11,
    color: C.textSecondary,
  },
  cardTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: 2,
  },
  cardOrg: {
    fontSize: 12,
    color: C.textMuted,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  locationText: {
    flex: 1,
    fontSize: 12,
    color: C.textSecondary,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: C.textSecondary,
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statText: {
    fontSize: 12,
    color: C.textMuted,
  },
  interestedBtn: {
    marginLeft: 'auto',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.yellowBorder,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  interestedBtnActive: {
    backgroundColor: C.yellow,
    borderColor: C.navy,
  },
  interestedText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.navy,
  },
  interestedTextActive: {
    color: C.bg,
  },
});
