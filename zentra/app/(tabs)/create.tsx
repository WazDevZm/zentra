import { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable,
  ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORY_META, Category } from '@/store/app-store';

const CATS: Category[] = ['Church', 'Academic', 'Social', 'Sports', 'Tech'];
type IName = React.ComponentProps<typeof Ionicons>['name'];

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
        <Text style={styles.successIcon}>🎉</Text>
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
      <StatusBar style="light" />

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
                <Ionicons name={meta.iconName as IName} size={14} color={active ? '#1A237E' : meta.color} />
                <Text style={[styles.catChipText, active && { color: '#1A237E' }]}> {cat}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Fields */}
        {[
          { key: 'title', label: 'Event Title *', placeholder: 'e.g. Vespers Service', value: title, onChange: setTitle, icon: '📌' },
          { key: 'date', label: 'Date *', placeholder: 'e.g. 2026-03-28', value: date, onChange: setDate, icon: '📅' },
          { key: 'time', label: 'Time *', placeholder: 'e.g. 17:00', value: time, onChange: setTime, icon: '⏰' },
          { key: 'location', label: 'Location *', placeholder: 'e.g. SBE Lawns', value: location, onChange: setLocation, icon: '📍' },
          { key: 'zone', label: 'Campus Zone', placeholder: 'e.g. Main Campus', value: zone, onChange: setZone, icon: '🗺' },
        ].map(field => (
          <View key={field.key} style={styles.fieldWrap}>
            <Text style={styles.label}>{field.label}</Text>
            <View style={[styles.inputWrap, focused === field.key && styles.inputFocused]}>
              <Text style={styles.inputIcon}>{field.icon}</Text>
              <TextInput
                style={styles.input}
                placeholder={field.placeholder}
                placeholderTextColor="rgba(255,255,255,0.3)"
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
              placeholderTextColor="rgba(255,255,255,0.3)"
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
          <Text style={styles.posterIcon}>🖼</Text>
          <View>
            <Text style={styles.posterTitle}>Upload Poster / Image</Text>
            <Text style={styles.posterSub}>Optional — tap to select from gallery</Text>
          </View>
        </Pressable>

        {/* Notification note */}
        <View style={styles.notifNote}>
          <Text style={styles.notifNoteIcon}>🔔</Text>
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
  container: { flex: 1, backgroundColor: '#1A237E' },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#283593',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,235,59,0.12)',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 },
  scroll: { padding: 20 },
  label: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8, fontWeight: '500' },
  catRow: { marginBottom: 20 },
  catChip: {
    borderRadius: 20, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  catChipText: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  fieldWrap: { marginBottom: 16 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 14, height: 52,
  },
  inputFocused: { borderColor: '#FFEB3B', backgroundColor: 'rgba(255,235,59,0.07)' },
  inputIcon: { fontSize: 16, marginRight: 10, opacity: 0.6 },
  input: { flex: 1, color: '#fff', fontSize: 15 },
  textAreaWrap: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 14, minHeight: 100,
  },
  textArea: { color: '#fff', fontSize: 15, lineHeight: 22 },
  posterBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
    padding: 16, marginBottom: 16,
  },
  posterIcon: { fontSize: 28 },
  posterTitle: { fontSize: 14, fontWeight: '600', color: '#fff' },
  posterSub: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  notifNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: 'rgba(255,235,59,0.09)',
    borderRadius: 12, borderWidth: 1,
    borderColor: 'rgba(255,235,59,0.22)',
    padding: 12, marginBottom: 24,
  },
  notifNoteIcon: { fontSize: 16 },
  notifNoteText: { flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 18 },
  submitBtn: {
    backgroundColor: '#FFEB3B', borderRadius: 14,
    height: 54, alignItems: 'center', justifyContent: 'center',
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitText: { color: '#1A237E', fontSize: 16, fontWeight: '800' },
  successContainer: {
    flex: 1, backgroundColor: '#1A237E',
    alignItems: 'center', justifyContent: 'center', padding: 40,
  },
  successIcon: { fontSize: 60, marginBottom: 20 },
  successTitle: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 12 },
  successSub: { fontSize: 14, color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 22 },
});
