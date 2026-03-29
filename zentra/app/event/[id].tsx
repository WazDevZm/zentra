import { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import {
  mockEvents, CATEGORY_META, formatEventTime,
} from '@/store/app-store';
import { C } from '@/constants/theme';

type IName = React.ComponentProps<typeof Ionicons>['name'];

const GALLERY_BY_CATEGORY: Record<string, string[]> = {
  Church: [
    'https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=1200&q=80',
    'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200&q=80',
  ],
  Academic: [
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=80',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80',
  ],
  Social: [
    'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=1200&q=80',
    'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200&q=80',
  ],
  Sports: [
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=80',
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=80',
  ],
  Tech: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80',
  ],
};

export default function EventDetail() {
  const { width } = useWindowDimensions();
  const {
    id,
    interestedByMe: interestedByMeParam,
    interestedCount: interestedCountParam,
    savedByMe: savedByMeParam,
  } = useLocalSearchParams<{ id: string; interestedByMe?: string; interestedCount?: string }>();
  const event = mockEvents.find(e => e.id === id);

  const parsedInterested =
    interestedByMeParam === '1' ? true : interestedByMeParam === '0' ? false : event?.interestedByMe;
  const parsedInterestedCount = Number(interestedCountParam);
  const resolvedInterestedCount = Number.isFinite(parsedInterestedCount)
    ? parsedInterestedCount
    : event?.interested;

  const [interestedByMe, setInterestedByMe] = useState(parsedInterested ?? false);
  const [interestedCount, setInterestedCount] = useState(resolvedInterestedCount ?? 0);
  const [savedByMe, setSavedByMe] = useState(savedByMeParam === '1');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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
  const galleryImages = useMemo(() => {
    const merged = [event.imageUrl, ...(GALLERY_BY_CATEGORY[event.category] ?? [])].filter(
      Boolean
    ) as string[];
    return [...new Set(merged)].slice(0, 4);
  }, [event.category, event.imageUrl]);
  const slideWidth = Math.max(220, width - 40);

  const toggleInterested = () => {
    setInterestedByMe(prev => {
      const next = !prev;
      setInterestedCount(count => (next ? count + 1 : Math.max(0, count - 1)));
      return next;
    });
  };

  const openWhatsApp = async () => {
    const phone = event.organizerWhatsApp ?? event.organizerPhone;
    if (!phone) {
      Alert.alert('Contact unavailable', 'Organizer WhatsApp number is not available for this event.');
      return;
    }
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    const text = encodeURIComponent(`Hi ${event.organizer}, I am interested in ${event.title}.`);
    const directUrl = `whatsapp://send?phone=${cleanPhone}&text=${text}`;
    const webUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${text}`;
    const canOpenDirect = await Linking.canOpenURL(directUrl);
    await Linking.openURL(canOpenDirect ? directUrl : webUrl);
  };

  const callOrganizer = async () => {
    const phone = event.organizerPhone ?? event.organizerWhatsApp;
    if (!phone) {
      Alert.alert('Contact unavailable', 'Organizer phone number is not available for this event.');
      return;
    }
    await Linking.openURL(`tel:${phone}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: meta.bg }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={C.textPrimary} />
        </Pressable>
        <View style={[styles.heroCatBadge, { backgroundColor: meta.color }]}>
          <Text style={styles.heroCatText}>{event.category}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Event image slider */}
        <View style={styles.galleryWrap}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={e => {
              const nextIndex = Math.round(e.nativeEvent.contentOffset.x / slideWidth);
              setActiveImageIndex(nextIndex);
            }}
          >
            {galleryImages.map((imageUri, index) => (
              <View key={`${event.id}-${index}`} style={[styles.gallerySlide, { width: slideWidth }]}>
                <Image source={{ uri: imageUri }} style={styles.galleryImage} />
                <View style={styles.galleryOverlay}>
                  <Text style={styles.galleryLabel}>{event.category} event vibe</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.galleryDots}>
            {galleryImages.map((_, index) => (
              <View
                key={`dot-${index}`}
                style={[styles.galleryDot, index === activeImageIndex && styles.galleryDotActive]}
              />
            ))}
          </View>
        </View>

        {/* Title block */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.organizer}>by {event.organizer}</Text>
          <View style={[styles.statusPill, interestedByMe && styles.statusPillActive]}>
            <Ionicons
              name={interestedByMe ? 'star' : 'star-outline'}
              size={12}
              color={interestedByMe ? C.navy : C.textSecondary}
            />
            <Text style={[styles.statusPillText, interestedByMe && styles.statusPillTextActive]}>
              {interestedByMe ? 'Interested' : 'Not interested yet'}
            </Text>
          </View>
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

        {/* Event poster */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Poster</Text>
          {event.posterUrl ? (
            <View style={styles.posterCard}>
              <Image source={{ uri: event.posterUrl }} style={styles.posterImage} resizeMode="cover" />
            </View>
          ) : (
            <View style={styles.posterEmpty}>
              <Ionicons name="image-outline" size={18} color={C.textMuted} />
              <Text style={styles.posterEmptyText}>No poster uploaded by organizer yet</Text>
            </View>
          )}
        </View>

        {/* Engagement stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard icon="eye-outline" label="Views" value={event.views} color={meta.color} />
            <StatCard icon="star-outline" label="Interested" value={interestedCount} color={meta.color} />
            <StatCard icon="people-outline" label="Est. Attendance" value={event.attendanceEstimate} color={meta.color} />
          </View>
        </View>

        {/* Take action */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Take Action</Text>
          <View style={styles.actionsGrid}>
            <Pressable
              style={[styles.actionBtn, interestedByMe && styles.actionBtnActive]}
              onPress={toggleInterested}
            >
              <Ionicons name={interestedByMe ? 'star' : 'star-outline'} size={16} color={C.navy} />
              <Text style={styles.actionText}>{interestedByMe ? 'Interested' : 'Interested'}</Text>
            </Pressable>

            <Pressable
              style={[styles.actionBtn, savedByMe && styles.actionBtnActive]}
              onPress={() => setSavedByMe(prev => !prev)}
            >
              <Ionicons name={savedByMe ? 'bookmark' : 'bookmark-outline'} size={16} color={C.navy} />
              <Text style={styles.actionText}>{savedByMe ? 'Saved' : 'Save Event'}</Text>
            </Pressable>

            <Pressable style={styles.actionBtn} onPress={openWhatsApp}>
              <Ionicons name="logo-whatsapp" size={16} color={C.navy} />
              <Text style={styles.actionText}>WhatsApp</Text>
            </Pressable>

            <Pressable style={styles.actionBtn} onPress={callOrganizer}>
              <Ionicons name="call-outline" size={16} color={C.navy} />
              <Text style={styles.actionText}>Call</Text>
            </Pressable>
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
          style={[styles.intBtn, interestedByMe && { backgroundColor: meta.color, borderColor: meta.color }]}
          onPress={toggleInterested}
        >
          <Text style={[styles.intBtnText, interestedByMe && { color: '#1A237E' }]}> 
            {interestedByMe ? `Interested (${interestedCount})` : `I'm Interested`}
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
  heroCatBadge: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  heroCatText: { color: C.navy, fontSize: 13, fontWeight: '700' },
  scroll: { paddingHorizontal: 20, paddingTop: 24 },
  galleryWrap: {
    marginBottom: 18,
  },
  gallerySlide: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.bgCard,
    marginRight: 10,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  galleryOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  galleryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  galleryDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  galleryDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.border,
  },
  galleryDotActive: {
    width: 18,
    backgroundColor: C.navy,
  },
  titleBlock: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', color: C.textPrimary, marginBottom: 4 },
  organizer: { fontSize: 13, color: C.textMuted, marginBottom: 10 },
  statusPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.bgCard,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusPillActive: {
    borderColor: C.yellowBorder,
    backgroundColor: C.yellowBg,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.textSecondary,
  },
  statusPillTextActive: {
    color: C.navy,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionBtn: {
    minHeight: 42,
    minWidth: '48%',
    flexGrow: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.bgCard,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  actionBtnActive: {
    backgroundColor: C.yellowBg,
    borderColor: C.yellowBorder,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.navy,
  },
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
  posterCard: {
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    aspectRatio: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.bgCard,
    overflow: 'hidden',
    padding: 8,
  },
  posterImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: C.bg,
  },
  posterEmpty: {
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: C.border,
    backgroundColor: C.bgCard,
    minHeight: 88,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
  },
  posterEmptyText: {
    fontSize: 12,
    color: C.textMuted,
    fontWeight: '600',
  },
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
    backgroundColor: C.yellowBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.yellowBorder,
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
    borderColor: C.yellowBorder,
  },
  intBtnText: { fontSize: 16, fontWeight: '800', color: C.navy },
});
