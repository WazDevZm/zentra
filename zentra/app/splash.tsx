import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineY = useRef(new Animated.Value(20)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const ring1Scale = useRef(new Animated.Value(0.6)).current;
  const ring1Opacity = useRef(new Animated.Value(0.6)).current;
  const ring2Scale = useRef(new Animated.Value(0.6)).current;
  const ring2Opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // Glow pulse loop
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, { toValue: 0.35, duration: 1200, useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 0.1, duration: 1200, useNativeDriver: true }),
      ])
    );

    // Ring pulse loop
    const ringLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ring1Scale, { toValue: 1.15, duration: 1400, useNativeDriver: true }),
          Animated.timing(ring1Opacity, { toValue: 0, duration: 1400, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(ring1Scale, { toValue: 0.6, duration: 0, useNativeDriver: true }),
          Animated.timing(ring1Opacity, { toValue: 0.6, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );

    const ring2Loop = Animated.loop(
      Animated.sequence([
        Animated.delay(700),
        Animated.parallel([
          Animated.timing(ring2Scale, { toValue: 1.15, duration: 1400, useNativeDriver: true }),
          Animated.timing(ring2Opacity, { toValue: 0, duration: 1400, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(ring2Scale, { toValue: 0.6, duration: 0, useNativeDriver: true }),
          Animated.timing(ring2Opacity, { toValue: 0.4, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );

    // Entrance sequence
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(taglineOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(taglineY, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
    ]).start();

    glowLoop.start();
    ringLoop.start();
    ring2Loop.start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(taglineOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start(() => {
        router.replace('/sign-in');
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [
    glowOpacity,
    logoOpacity,
    logoScale,
    ring1Opacity,
    ring1Scale,
    ring2Opacity,
    ring2Scale,
    taglineOpacity,
    taglineY,
  ]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Background gradient layers */}
      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />

      {/* Decorative circles */}
      <View style={[styles.decorCircle, styles.decorCircle1]} />
      <View style={[styles.decorCircle, styles.decorCircle2]} />
      <View style={[styles.decorCircle, styles.decorCircle3]} />

      {/* Pulse rings */}
      <Animated.View
        style={[
          styles.pulseRing,
          { transform: [{ scale: ring1Scale }], opacity: ring1Opacity },
        ]}
      />
      <Animated.View
        style={[
          styles.pulseRing,
          { transform: [{ scale: ring2Scale }], opacity: ring2Opacity },
        ]}
      />

      {/* Glow behind logo */}
      <Animated.View style={[styles.logoGlow, { opacity: glowOpacity }]} />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* App name */}
      <Animated.View style={{ opacity: logoOpacity }}>
        <Text style={styles.appName}>ZENTRA</Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.View
        style={{
          opacity: taglineOpacity,
          transform: [{ translateY: taglineY }],
        }}
      >
        <View style={styles.taglineRow}>
          <View style={styles.taglineLine} />
          <Text style={styles.tagline}>Stay informed. Stay involved.</Text>
          <View style={styles.taglineLine} />
        </View>
      </Animated.View>

      {/* Bottom accent */}
      <View style={styles.bottomAccent}>
        <View style={styles.accentDot} />
        <View style={[styles.accentDot, styles.accentDotActive]} />
        <View style={styles.accentDot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A237E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgTop: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: width * 1.2,
    height: height * 0.6,
    backgroundColor: '#283593',
    borderBottomLeftRadius: width,
    borderBottomRightRadius: width,
    opacity: 0.6,
  },
  bgBottom: {
    position: 'absolute',
    bottom: -80,
    right: -80,
    width: 300,
    height: 300,
    backgroundColor: '#3949AB',
    borderRadius: 150,
    opacity: 0.3,
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#FFEB3B',
  },
  decorCircle1: {
    width: 320,
    height: 320,
    opacity: 0.06,
    top: height * 0.5 - 160,
    left: width * 0.5 - 160,
  },
  decorCircle2: {
    width: 220,
    height: 220,
    opacity: 0.1,
    top: height * 0.5 - 110,
    left: width * 0.5 - 110,
  },
  decorCircle3: {
    width: 400,
    height: 400,
    opacity: 0.04,
    top: height * 0.5 - 200,
    left: width * 0.5 - 200,
  },
  pulseRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#FFEB3B',
  },
  logoGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FFEB3B',
  },
  logoContainer: {
    width: 130,
    height: 130,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,235,59,0.32)',
    shadowColor: '#FFEB3B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 20,
  },
  logo: {
    width: 90,
    height: 90,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 10,
    marginBottom: 14,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  taglineLine: {
    width: 30,
    height: 1,
    backgroundColor: '#FFEB3B',
    opacity: 0.7,
  },
  tagline: {
    fontSize: 13,
    color: '#FFEB3B',
    letterSpacing: 1.5,
    fontWeight: '500',
    opacity: 0.9,
  },
  bottomAccent: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  accentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,235,59,0.32)',
  },
  accentDotActive: {
    width: 20,
    backgroundColor: '#FFEB3B',
    opacity: 0.8,
  },
});
