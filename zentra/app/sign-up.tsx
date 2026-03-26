import { useRef, useEffect, useState } from 'react';
import {
  Animated, Dimensions, Image, KeyboardAvoidingView,
  Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/constants/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];
const { width } = Dimensions.get('window');

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, [fadeIn, slideUp]);

  const fields: { key: string; label: string; icon: IoniconsName; placeholder: string; value: string; onChange: (v: string) => void; keyboardType: 'default' | 'email-address'; secure: boolean }[] = [
    { key: 'name',     label: 'Full Name',        icon: 'person-outline',      placeholder: 'John Doe',         value: name,     onChange: setName,     keyboardType: 'default',       secure: false },
    { key: 'email',    label: 'Email',             icon: 'mail-outline',        placeholder: 'you@example.com',  value: email,    onChange: setEmail,    keyboardType: 'email-address', secure: false },
    { key: 'password', label: 'Password',          icon: 'lock-closed-outline', placeholder: '••••••••',         value: password, onChange: setPassword, keyboardType: 'default',       secure: true  },
    { key: 'confirm',  label: 'Confirm Password',  icon: 'lock-closed-outline', placeholder: '••••••••',         value: confirm,  onChange: setConfirm,  keyboardType: 'default',       secure: true  },
  ];

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar style="light" />

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
          <Text style={styles.cardTitle}>Create account</Text>
          <Text style={styles.cardSubtitle}>Join the community today</Text>

          {fields.map(field => (
            <View key={field.key} style={styles.fieldWrap}>
              <Text style={styles.label}>{field.label}</Text>
              <View style={[styles.inputWrap, focused === field.key && styles.inputFocused]}>
                <Ionicons
                  name={field.icon}
                  size={18}
                  color={focused === field.key ? C.yellow : 'rgba(255,255,255,0.4)'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={field.placeholder}
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={field.value}
                  onChangeText={field.onChange}
                  keyboardType={field.keyboardType}
                  autoCapitalize={field.key === 'name' ? 'words' : 'none'}
                  secureTextEntry={field.secure && !showPassword}
                  onFocus={() => setFocused(field.key)}
                  onBlur={() => setFocused(null)}
                />
                {field.secure && (
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="rgba(255,255,255,0.4)" />
                  </Pressable>
                )}
              </View>
            </View>
          ))}

          <Text style={styles.terms}>
            By signing up, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>

          <Pressable
            style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
            onPress={() => router.replace('/onboarding')}
          >
            <Text style={styles.btnText}>Create Account</Text>
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.linkRow}>
            <Text style={styles.linkPrompt}>Already have an account? </Text>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.link}>Sign In</Text>
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
    position: 'absolute', top: -80, right: -80,
    width: width * 0.7, height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: C.bgCard, opacity: 0.6,
  },
  blob2: {
    position: 'absolute', bottom: -80, left: -60,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: C.yellowBg,
  },
  scroll: { flexGrow: 1, alignItems: 'center', paddingTop: 64, paddingBottom: 48, paddingHorizontal: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  logoWrap: {
    width: 110, height: 110, borderRadius: 28,
    backgroundColor: C.bgCard,
    borderWidth: 1.5, borderColor: C.yellowBorder,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    shadowColor: C.yellow, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  logo: { width: 80, height: 80 },
  appName: { fontSize: 32, fontWeight: '800', color: C.textPrimary, letterSpacing: 8, marginBottom: 6 },
  tagline: { fontSize: 13, color: C.yellow, opacity: 0.8, letterSpacing: 0.5 },
  card: {
    width: '100%',
    backgroundColor: C.bgCard,
    borderRadius: 24, borderWidth: 1, borderColor: C.border,
    padding: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 10,
  },
  cardTitle: { fontSize: 22, fontWeight: '700', color: C.textPrimary, marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: C.textSecondary, marginBottom: 24 },
  fieldWrap: { marginBottom: 14 },
  label: { fontSize: 13, color: C.textSecondary, marginBottom: 8, fontWeight: '500' },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.bgSurface,
    borderRadius: 12, borderWidth: 1.5, borderColor: C.border,
    paddingHorizontal: 14, height: 54,
  },
  inputFocused: { borderColor: C.yellow, backgroundColor: C.yellowBg },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: C.textPrimary, fontSize: 15 },
  terms: { fontSize: 12, color: C.textMuted, textAlign: 'center', marginBottom: 20, marginTop: 8, lineHeight: 18 },
  termsLink: { color: C.yellow, opacity: 0.85 },
  btn: {
    backgroundColor: C.yellow, borderRadius: 14, height: 56,
    alignItems: 'center', justifyContent: 'center',
  },
  btnPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  btnText: { color: C.bg, fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 22, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { color: C.textMuted, fontSize: 13 },
  linkRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  linkPrompt: { color: C.textSecondary, fontSize: 14 },
  link: { color: C.yellow, fontSize: 14, fontWeight: '700' },
});
