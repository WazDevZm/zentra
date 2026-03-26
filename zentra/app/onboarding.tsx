import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORY_META, Category } from '@/store/app-store';
import { C } from '@/constants/theme';

const CATS: Category[] = ['Church', 'Academic', 'Social', 'Sports', 'Tech'];
type IName = React.ComponentProps<typeof Ionicons>['name'];

export default function Onboarding() {
  const [selected, setSelected] = useState<Category[]>([]);

  const toggle = (cat: Category) => {
    setSelected(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.top}>
        <Ionicons name="sparkles-outline" size={44} color={C.navy} style={styles.emoji} />
        <Text style={styles.title}>What are you into?</Text>
        <Text style={styles.sub}>
          Pick your interests so we can show you the most relevant events on campus.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {CATS.map(cat => {
          const meta = CATEGORY_META[cat];
          const active = selected.includes(cat);
          return (
            <Pressable
              key={cat}
              style={[styles.card, active && { borderColor: meta.color, backgroundColor: meta.bg }]}
              onPress={() => toggle(cat)}
            >
              <Ionicons name={meta.iconName as IName} size={36} color={active ? meta.color : C.textMuted} />
              <Text style={[styles.cardLabel, active && { color: meta.color }]}>{cat}</Text>
              {active && (
                <View style={[styles.checkBadge, { backgroundColor: meta.color }]}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.bottom}>
        <Text style={styles.selectedCount}>
          {selected.length === 0 ? 'Select at least one' : `${selected.length} selected`}
        </Text>
        <Pressable
          style={[styles.btn, selected.length === 0 && styles.btnDisabled]}
          onPress={() => selected.length > 0 && router.replace('/(tabs)')}
        >
          <Text style={styles.btnText}>Get Started →</Text>
        </Pressable>
        <Pressable onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.skipText}>Skip for now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  top: { paddingTop: 92, paddingHorizontal: 28, paddingBottom: 32, alignItems: 'center' },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '800', color: C.textPrimary, textAlign: 'center', marginBottom: 10 },
  sub: { fontSize: 14, color: C.textSecondary, textAlign: 'center', lineHeight: 22 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    justifyContent: 'center',
  },
  card: {
    width: '44%',
    backgroundColor: C.bgCard,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: C.border,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  cardIcon: { fontSize: 36, marginBottom: 10 },
  cardLabel: { fontSize: 15, fontWeight: '700', color: C.textPrimary },
  checkBadge: {
    position: 'absolute', top: 10, right: 10,
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
  },
  checkText: { color: C.bg, fontSize: 12, fontWeight: '800' },
  bottom: { padding: 24, paddingBottom: 40, alignItems: 'center' },
  selectedCount: { fontSize: 13, color: C.textMuted, marginBottom: 14 },
  btn: {
    backgroundColor: C.yellow, borderRadius: 14,
    borderWidth: 1,
    borderColor: C.navy,
    height: 54, width: '100%',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: C.navy, fontSize: 16, fontWeight: '800' },
  skipText: { color: C.textSecondary, fontSize: 13 },
});
