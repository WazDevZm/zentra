import { useRef, useEffect, useState } from 'react';
import {
  Animated, Dimensions, Image, KeyboardAvoidingView,
  Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, [fadeIn, slideUp]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar style="dark" />

      {/* Decorative blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        <Animated.View style={[styles.header, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>
          <View style={styles.logoWrap}>
            <Image source={require('../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.appName}>Zentra</Text>
          <Text style={styles.tagline}>Stay informed. Stay involved.</Text>
        </Animated.View>

        <Animated.View style={[styles.card, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>
          <Text style={styles.cardTitle}>Welcome back</Text>
          <Text style={styles.cardSubtitle}>Sign in to your account</Text>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputWrap, emailFocused && styles.inputFocused]}>
              <Ionicons name="mail-outline" size={18} color={emailFocused ? C.navy : C.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={C.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrap, passwordFocused && styles.inputFocused]}>
              <Ionicons name="lock-closed-outline" size={18} color={passwordFocused ? C.navy : C.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={C.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={C.textMuted} />
              </Pressable>
            </View>
          </View>

          <Pressable style={styles.forgotWrap}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.btnText}>Sign In</Text>
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.linkRow}>
            <Text style={styles.linkPrompt}>Don&apos;t have an account? </Text>
            <Pressable onPress={() => router.push('/sign-up')}>
              <Text style={styles.link}>Sign Up</Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  blob1: {
    position: 'absolute', top: -80, left: -80,
    width: width * 0.8, height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: C.bgCard, opacity: 0.6,
  },
  blob2: {
    position: 'absolute', bottom: -100, right: -60,
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: C.yellowBg,
  },
  scroll: { flexGrow: 1, alignItems: 'center', paddingTop: 64, paddingBottom: 36, paddingHorizontal: 20 },
  header: { alignItems: 'center', marginBottom: 28 },
  logoWrap: {
    width: 96, height: 96, borderRadius: 24,
    backgroundColor: C.bgCard,
    borderWidth: 1.5, borderColor: C.yellowBorder,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  logo: { width: 70, height: 70 },
  appName: { fontSize: 28, fontWeight: '800', color: C.textPrimary, letterSpacing: 6, marginBottom: 4 },
  tagline: { fontSize: 13, color: C.textSecondary, opacity: 0.9, letterSpacing: 0.5 },
  card: {
    width: '100%',
    backgroundColor: C.bgCard,
    borderRadius: 24, borderWidth: 1, borderColor: C.border,
    padding: 22,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 10,
  },
  cardTitle: { fontSize: 22, fontWeight: '700', color: C.textPrimary, marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: C.textSecondary, marginBottom: 20 },
  fieldWrap: { marginBottom: 16 },
  label: { fontSize: 13, color: C.textSecondary, marginBottom: 8, fontWeight: '500' },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.bgSurface,
    borderRadius: 12, borderWidth: 1.5, borderColor: C.border,
    paddingHorizontal: 14, height: 54,
  },
  inputFocused: { borderColor: C.navy, backgroundColor: C.bg },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: C.textPrimary, fontSize: 15 },
  forgotWrap: { alignSelf: 'flex-end', marginBottom: 24, marginTop: 4 },
  forgotText: { color: C.navyLight, fontSize: 13, opacity: 0.9 },
  btn: {
    backgroundColor: C.yellow, borderRadius: 14, height: 56,
    borderWidth: 1,
    borderColor: C.navy,
    alignItems: 'center', justifyContent: 'center',
  },
  btnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  btnText: { color: C.navy, fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { color: C.textMuted, fontSize: 13 },
  linkRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  linkPrompt: { color: C.textSecondary, fontSize: 14 },
  link: { color: C.navy, fontSize: 14, fontWeight: '700' },
});
// UI in the top of the navigator is being cut by the top of the ana bar