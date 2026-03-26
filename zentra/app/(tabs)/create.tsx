import { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable,
  ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORY_META, Category } from '@/store/app-store';
import { C } from '@/constants/theme';

const CATS: Category[] = ['Church', 'Academic', 'Social', 'Sports', 'Tech'];
type IName = React.ComponentProps<typeof Ionicons>['name'];
type FormIconName = React.ComponentProps<typeof Ionicons>['name'];

export default function CreateScreen() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [zone, setZone] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const canSubmit = title && category && date && time && location && description;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTitle(''); setCategory(null); setDate(''); setTime('');
      setLocation(''); setZone(''); setDescription('');
      router.replace('/(tabs)');
    }, 2000);
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <Ionicons name="checkmark-circle" size={62} color={C.navy} style={styles.successIcon} />
        <Text style={styles.successTitle}>Event Created!</Text>
        <Text style={styles.successSub}>Your event has been posted. Notifications will be sent to interested students.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create Event</Text>
        <Text style={styles.headerSub}>Post an event for the campus community</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Category picker */}
        <Text style={styles.label}>Category *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow} contentContainerStyle={{ gap: 8 }}>
          {CATS.map(cat => {
            const meta = CATEGORY_META[cat];
            const active = category === cat;
            return (
              <Pressable
                key={cat}
                style={[styles.catChip, active && { backgroundColor: meta.color, borderColor: meta.color }]}
                onPress={() => setCategory(cat)}
              >
                <Ionicons name={meta.iconName as IName} size={14} color={active ? C.navy : meta.color} />
                <Text style={[styles.catChipText, active && { color: C.navy }]}> {cat}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Fields */}
        {[
          { key: 'title', label: 'Event Title *', placeholder: 'e.g. Vespers Service', value: title, onChange: setTitle, icon: 'bookmark-outline' as FormIconName },
          { key: 'date', label: 'Date *', placeholder: 'e.g. 2026-03-28', value: date, onChange: setDate, icon: 'calendar-outline' as FormIconName },
          { key: 'time', label: 'Time *', placeholder: 'e.g. 17:00', value: time, onChange: setTime, icon: 'time-outline' as FormIconName },
          { key: 'location', label: 'Location *', placeholder: 'e.g. SBE Lawns', value: location, onChange: setLocation, icon: 'location-outline' as FormIconName },
          { key: 'zone', label: 'Campus Zone', placeholder: 'e.g. Main Campus', value: zone, onChange: setZone, icon: 'map-outline' as FormIconName },
        ].map(field => (
          <View key={field.key} style={styles.fieldWrap}>
            <Text style={styles.label}>{field.label}</Text>
            <View style={[styles.inputWrap, focused === field.key && styles.inputFocused]}>
              <Ionicons name={field.icon} size={16} color={C.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={field.placeholder}
                placeholderTextColor={C.textMuted}
                value={field.value}
                onChangeText={field.onChange}
                onFocus={() => setFocused(field.key)}
                onBlur={() => setFocused(null)}
              />
            </View>
          </View>
        ))}

        {/* Description */}
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Description *</Text>
          <View style={[styles.textAreaWrap, focused === 'desc' && styles.inputFocused]}>
            <TextInput
              style={styles.textArea}
              placeholder="Describe your event..."
              placeholderTextColor={C.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              onFocus={() => setFocused('desc')}
              onBlur={() => setFocused(null)}
            />
          </View>
        </View>

        {/* Poster upload hint */}
        <Pressable style={styles.posterBtn}>
          <Ionicons name="images-outline" size={26} color={C.navy} style={styles.posterIcon} />
          <View>
            <Text style={styles.posterTitle}>Upload Poster / Image</Text>
            <Text style={styles.posterSub}>Optional — tap to select from gallery</Text>
          </View>
        </Pressable>

        {/* Notification note */}
        <View style={styles.notifNote}>
          <Ionicons name="notifications-outline" size={16} color={C.navy} style={styles.notifNoteIcon} />
          <Text style={styles.notifNoteText}>
            Push notifications will be sent to students interested in {category ?? 'this category'} events.
          </Text>
        </View>

        {/* Submit */}
        <Pressable
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>Post Event</Text>
        </Pressable>

        <View style={{ height: 100 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: {
    paddingTop: 82,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: C.bg,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: C.textPrimary },
  headerSub: { fontSize: 12, color: C.textSecondary, marginTop: 2 },
  scroll: { padding: 20, paddingTop: 24 },
  label: { fontSize: 13, color: C.textSecondary, marginBottom: 8, fontWeight: '500' },
  catRow: { marginBottom: 20 },
  catChip: {
    borderRadius: 20, borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: C.bgCard,
  },
  catChipText: { fontSize: 13, color: C.textSecondary, fontWeight: '500' },
  fieldWrap: { marginBottom: 16 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.bgCard,
    borderRadius: 12, borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14, height: 52,
  },
  inputFocused: { borderColor: C.navy, backgroundColor: C.bg },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: C.textPrimary, fontSize: 15 },
  textAreaWrap: {
    backgroundColor: C.bgCard,
    borderRadius: 12, borderWidth: 1,
    borderColor: C.border,
    padding: 14, minHeight: 100,
  },
  textArea: { color: C.textPrimary, fontSize: 15, lineHeight: 22 },
  posterBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: C.bgCard,
    borderRadius: 14, borderWidth: 1,
    borderColor: C.border,
    borderStyle: 'dashed',
    padding: 16, marginBottom: 16,
  },
  posterIcon: {},
  posterTitle: { fontSize: 14, fontWeight: '600', color: C.textPrimary },
  posterSub: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  notifNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: C.yellowBg,
    borderRadius: 12, borderWidth: 1,
    borderColor: C.yellowBorder,
    padding: 12, marginBottom: 24,
  },
  notifNoteIcon: { marginTop: 1 },
  notifNoteText: { flex: 1, fontSize: 12, color: C.textSecondary, lineHeight: 18 },
  submitBtn: {
    backgroundColor: C.yellow, borderRadius: 14,
    borderWidth: 1,
    borderColor: C.navy,
    height: 54, alignItems: 'center', justifyContent: 'center',
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitText: { color: C.navy, fontSize: 16, fontWeight: '800' },
  successContainer: {
    flex: 1, backgroundColor: C.bg,
    alignItems: 'center', justifyContent: 'center', padding: 40,
  },
  successIcon: { marginBottom: 20 },
  successTitle: { fontSize: 26, fontWeight: '800', color: C.textPrimary, marginBottom: 12 },
  successSub: { fontSize: 14, color: C.textSecondary, textAlign: 'center', lineHeight: 22 },
});
