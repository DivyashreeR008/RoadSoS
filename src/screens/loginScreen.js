import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  ScrollView,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { rtdb } from '../api/firestore';
import { ref, get, child } from "firebase/database";

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [focusedInput, setFocusedInput] = useState(null);
  
  // Animations
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial entrance animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Required", "Please enter both phone number and password.");
      return;
    }

    setLoading(true);
    try {
      const dbRef = ref(rtdb);
      const snapshot = await get(child(dbRef, `users/${phone}`));

      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.password === password) {
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            navigation.replace('Home');
          });
        } else {
          Alert.alert("Error", "Invalid password. Please try again.");
          setLoading(false);
        }
      } else {
        Alert.alert("Not Found", "No account found. Please register.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Login Error: ", error);
      Alert.alert("Connection Error", "Unable to connect. Check your internet.");
      setLoading(false);
    }
  };

  const floatY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#0A1B2E', '#0F2E45', '#1A3A52']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        {/* Animated Background Elements */}
        <Animated.View
          style={[
            styles.animatedBg,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={[styles.glowBlob, styles.glowBlob1]} />
          <View style={[styles.glowBlob, styles.glowBlob2]} />
          <View style={[styles.glowBlob, styles.glowBlob3]} />

          <Animated.View style={[styles.particle, styles.particle1, { transform: [{ translateY: floatY }] }]} />
          <Animated.View style={[styles.particle, styles.particle2, { transform: [{ translateY: floatY }] }]} />
          <Animated.View style={[styles.particle, styles.particle3, { transform: [{ translateY: floatY }] }]} />
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          scrollEventThrottle={16}
        >
          {/* Live Status Badge */}
          <View style={styles.statusBadge}>
            <Animated.View 
              style={[
                styles.statusDot,
                { 
                  opacity: glowOpacity,
                  transform: [{ scale: pulseAnim }]
                }
              ]}
            />
            <Text style={styles.statusLabel}>Emergency Network Online</Text>
          </View>

          {/* HERO SECTION */}
          <Animated.View
            style={[
              styles.heroSection,
              {
                opacity: opacityAnim,
                transform: [
                  {
                    translateY: opacityAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [60, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.heroIllustration}>
              <View style={styles.curvedRoad1} />
              <View style={styles.curvedRoad2} />

              <Animated.View 
                style={[
                  styles.heroIcon,
                  styles.ambulanceIcon,
                  { transform: [{ translateY: floatY }] }
                ]}
              >
                <Text style={styles.iconText}>🚑</Text>
              </Animated.View>

              <Animated.View 
                style={[
                  styles.heroIcon,
                  styles.locationIcon,
                  { transform: [{ translateY: floatY }] }
                ]}
              >
                <Text style={styles.iconText}>📍</Text>
              </Animated.View>

              <Animated.View 
                style={[
                  styles.heroIcon,
                  styles.sosIcon,
                  { transform: [{ translateY: floatY }] }
                ]}
              >
                <Text style={styles.iconText}>🚨</Text>
              </Animated.View>

              <Animated.View
                style={[
                  styles.signalWave,
                  { opacity: glowOpacity }
                ]}
              />
            </View>

            <Text style={styles.welcomeTitle}>Smart Emergency Support</Text>
            <Text style={styles.welcomeSubtitle}>For Safer Roads</Text>
            <Text style={styles.welcomeDescription}>
              AI-powered emergency response with real-time ambulance, police, and road assistance.
            </Text>
          </Animated.View>

          {/* AUTH MODE SELECTOR */}
          <View style={styles.modeSelector}>
            <TouchableOpacity
              style={[styles.modeTab, authMode === 'signin' && styles.modeTabActive]}
              onPress={() => setAuthMode('signin')}
            >
              <Text style={[styles.modeTabText, authMode === 'signin' && styles.modeTabTextActive]}>
                🔐 Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeTab, authMode === 'helper' && styles.modeTabActive]}
              onPress={() => setAuthMode('helper')}
            >
              <Text style={[styles.modeTabText, authMode === 'helper' && styles.modeTabTextActive]}>
                🆘 Helper
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeTab, authMode === 'register' && styles.modeTabActive]}
              onPress={() => setAuthMode('register')}
            >
              <Text style={[styles.modeTabText, authMode === 'register' && styles.modeTabTextActive]}>
                ✨ Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* AUTH FORM CARD */}
          <LinearGradient
            colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.04)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.authCard}
          >
            {authMode === 'signin' && (
              <>
                <View style={styles.floatingInputGroup}>
                  <Text style={styles.floatingLabel}>📱 Phone Number</Text>
                  <View
                    style={[
                      styles.floatingInputContainer,
                      focusedInput === 'phone' && styles.inputFocused,
                    ]}
                  >
                    <TextInput
                      placeholder="Your emergency contact number"
                      placeholderTextColor="#7A96B8"
                      style={styles.floatingInput}
                      keyboardType="phone-pad"
                      value={phone}
                      onChangeText={setPhone}
                      onFocus={() => setFocusedInput('phone')}
                      onBlur={() => setFocusedInput(null)}
                      editable={!loading}
                    />
                  </View>
                </View>

                <View style={styles.floatingInputGroup}>
                  <Text style={styles.floatingLabel}>🔑 Password</Text>
                  <View
                    style={[
                      styles.floatingInputContainer,
                      focusedInput === 'password' && styles.inputFocused,
                    ]}
                  >
                    <TextInput
                      placeholder="Your secure password"
                      placeholderTextColor="#7A96B8"
                      style={styles.floatingInput}
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() => setFocusedInput('password')}
                      onBlur={() => setFocusedInput(null)}
                      editable={!loading}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeToggle}
                    >
                      <Text>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity style={styles.forgotPasswordLink}>
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>

                <LinearGradient
                  colors={['#FF2D55', '#FF1744']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.premiumButton}
                >
                  <TouchableOpacity
                    onPress={handleLogin}
                    disabled={loading}
                    style={styles.buttonInner}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <>
                        <Text style={styles.buttonIcon}>🔓</Text>
                        <Text style={styles.buttonText}>SECURE LOGIN</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </LinearGradient>
              </>
            )}

            {authMode === 'helper' && (
              <>
                <Text style={styles.helperModeTitle}>Become an Emergency Helper</Text>
                <Text style={styles.helperModeDesc}>
                  Ambulance drivers, police officers, and roadside assistance providers.
                </Text>

                <View style={styles.helperQuickStart}>
                  <View style={styles.helperOption}>
                    <Text style={styles.helperOptionIcon}>🚑</Text>
                    <Text style={styles.helperOptionText}>Ambulance</Text>
                  </View>
                  <View style={styles.helperOption}>
                    <Text style={styles.helperOptionIcon}>🚔</Text>
                    <Text style={styles.helperOptionText}>Police</Text>
                  </View>
                  <View style={styles.helperOption}>
                    <Text style={styles.helperOptionIcon}>🛠️</Text>
                    <Text style={styles.helperOptionText}>Roadside</Text>
                  </View>
                </View>

                <LinearGradient
                  colors={['#00D4FF', '#00B8E6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.premiumButton}
                >
                  <TouchableOpacity
                    style={styles.buttonInner}
                    onPress={() => navigation.navigate('Register')}
                  >
                    <Text style={styles.buttonIcon}>🆘</Text>
                    <Text style={styles.buttonText}>REGISTER AS HELPER</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </>
            )}

            {authMode === 'register' && (
              <>
                <Text style={styles.registerTitle}>Join RoadSoS Community</Text>
                <Text style={styles.registerDesc}>
                  Create an account to access 24/7 emergency support.
                </Text>

                <View style={styles.benefitsGrid}>
                  <View style={styles.benefitItem}>
                    <Text style={styles.benefitIcon}>⚡</Text>
                    <Text style={styles.benefitText}>Instant Alerts</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Text style={styles.benefitIcon}>🤝</Text>
                    <Text style={styles.benefitText}>Community Support</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Text style={styles.benefitIcon}>🛡️</Text>
                    <Text style={styles.benefitText}>Protected 24/7</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Text style={styles.benefitIcon}>📍</Text>
                    <Text style={styles.benefitText}>Live Tracking</Text>
                  </View>
                </View>

                <LinearGradient
                  colors={['#00FF88', '#00DD7B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.premiumButton}
                >
                  <TouchableOpacity
                    style={styles.buttonInner}
                    onPress={() => navigation.navigate('Register')}
                  >
                    <Text style={styles.buttonIcon}>✨</Text>
                    <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </>
            )}

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social/Alternative Auth */}
            <View style={styles.altAuthContainer}>
              <TouchableOpacity style={styles.altAuthButton}>
                <Text style={styles.altAuthIcon}>G</Text>
                <Text style={styles.altAuthText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.altAuthButton}>
                <Text style={styles.altAuthIcon}>🍎</Text>
                <Text style={styles.altAuthText}>Apple</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.altAuthButton}>
                <Text style={styles.altAuthIcon}>M</Text>
                <Text style={styles.altAuthText}>Microsoft</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* TRUST BADGES */}
          <View style={styles.trustSection}>
            <View style={styles.trustBadge}>
              <Text style={styles.trustIcon}>🔒</Text>
              <Text style={styles.trustLabel}>Encrypted</Text>
            </View>
            <View style={styles.trustBadge}>
              <Text style={styles.trustIcon}>✓</Text>
              <Text style={styles.trustLabel}>Verified</Text>
            </View>
            <View style={styles.trustBadge}>
              <Text style={styles.trustIcon}>⭐</Text>
              <Text style={styles.trustLabel}>Trusted</Text>
            </View>
            <View style={styles.trustBadge}>
              <Text style={styles.trustIcon}>🌐</Text>
              <Text style={styles.trustLabel}>Global</Text>
            </View>
          </View>

          {/* LIVE ACTIVITY SECTION */}
          <View style={styles.liveActivitySection}>
            <LinearGradient
              colors={['rgba(0,255,136,0.1)', 'rgba(0,212,255,0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.activityCard}
            >
              <View style={styles.activityHeader}>
                <Animated.View style={[styles.activeDot, { opacity: glowOpacity }]} />
                <Text style={styles.activityTitle}>Live Activity</Text>
              </View>
              <View style={styles.activityStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>1,247</Text>
                  <Text style={styles.statLabel}>Protected Users</Text>
                </View>
                <View style={styles.dividerVertical} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>342</Text>
                  <Text style={styles.statLabel}>Nearby Responders</Text>
                </View>
                <View style={styles.dividerVertical} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>98%</Text>
                  <Text style={styles.statLabel}>Response Rate</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* EMERGENCY QUICK ACCESS */}
          <TouchableOpacity style={styles.emergencyQuickAccess}>
            <LinearGradient
              colors={['rgba(255,45,85,0.2)', 'rgba(255,45,85,0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.emergencyInner}
            >
              <Text style={styles.emergencyQuickIcon}>🚨</Text>
              <View style={styles.emergencyQuickText}>
                <Text style={styles.emergencyQuickTitle}>Emergency? Need Help Now?</Text>
                <Text style={styles.emergencyQuickDesc}>Skip login and get instant assistance</Text>
              </View>
              <Text style={styles.emergencyQuickArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footerSection}>
            <Text style={styles.footerText}>
              © 2024 RoadSoS — Protecting Lives on Every Road
            </Text>
            <View style={styles.footerLinks}>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Privacy</Text>
              </TouchableOpacity>
              <Text style={styles.footerDot}>•</Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Terms</Text>
              </TouchableOpacity>
              <Text style={styles.footerDot}>•</Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Support</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  animatedBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  glowBlob: {
    position: 'absolute',
    borderRadius: 200,
  },
  glowBlob1: {
    width: 400,
    height: 400,
    backgroundColor: '#FF2D55',
    opacity: 0.05,
    top: -100,
    right: -100,
  },
  glowBlob2: {
    width: 300,
    height: 300,
    backgroundColor: '#00D4FF',
    opacity: 0.03,
    bottom: 100,
    right: 50,
  },
  glowBlob3: {
    width: 350,
    height: 350,
    backgroundColor: '#00FF88',
    opacity: 0.02,
    bottom: -50,
    left: -100,
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
  },
  particle1: {
    width: 4,
    height: 4,
    backgroundColor: '#00FF88',
    opacity: 0.4,
    top: '20%',
    left: '15%',
  },
  particle2: {
    width: 3,
    height: 3,
    backgroundColor: '#FF2D55',
    opacity: 0.3,
    top: '40%',
    right: '20%',
  },
  particle3: {
    width: 5,
    height: 5,
    backgroundColor: '#00D4FF',
    opacity: 0.25,
    bottom: '30%',
    left: '10%',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },

  /* Status Badge */
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FF88',
    shadowColor: '#00FF88',
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  statusLabel: {
    fontSize: 11,
    color: '#00FF88',
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  /* Hero Section */
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  heroIllustration: {
    width: width - 32,
    height: 140,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  curvedRoad1: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(255,45,85,0.3)',
    bottom: '30%',
    transform: [{ skewY: '-5deg' }],
  },
  curvedRoad2: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(0,212,255,0.3)',
    bottom: '60%',
    transform: [{ skewY: '5deg' }],
  },
  heroIcon: {
    position: 'absolute',
    fontSize: 32,
  },
  ambulanceIcon: {
    left: '15%',
    bottom: '35%',
  },
  locationIcon: {
    right: '20%',
    top: '20%',
  },
  sosIcon: {
    left: '50%',
    top: '40%',
  },
  iconText: {
    fontSize: 28,
  },
  signalWave: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#00D4FF',
    bottom: '25%',
    right: '15%',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#00D4FF',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.8,
  },
  welcomeDescription: {
    fontSize: 12,
    color: '#A8C5DD',
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
  },

  /* Mode Selector */
  modeSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modeTabActive: {
    backgroundColor: 'rgba(255,45,85,0.3)',
    borderWidth: 1,
    borderColor: '#FF2D55',
  },
  modeTabText: {
    fontSize: 11,
    color: '#7A96B8',
    fontWeight: '600',
  },
  modeTabTextActive: {
    color: '#FF2D55',
    fontWeight: '700',
  },

  /* Auth Card */
  authCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },

  /* Input Fields */
  floatingInputGroup: {
    marginBottom: 16,
  },
  floatingLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A8C5DD',
    marginBottom: 6,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  floatingInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  inputFocused: {
    borderColor: '#00D4FF',
    backgroundColor: 'rgba(0,212,255,0.08)',
    shadowColor: '#00D4FF',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  floatingInput: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  eyeToggle: {
    padding: 4,
    marginLeft: 8,
  },

  /* Forgot Password */
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: 14,
  },
  forgotPasswordText: {
    fontSize: 12,
    color: '#00D4FF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  /* Buttons */
  premiumButton: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#FF2D55',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  buttonIcon: {
    fontSize: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },

  /* Helper Mode */
  helperModeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  helperModeDesc: {
    fontSize: 12,
    color: '#A8C5DD',
    marginBottom: 16,
    lineHeight: 18,
  },
  helperQuickStart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  helperOption: {
    alignItems: 'center',
    gap: 6,
  },
  helperOptionIcon: {
    fontSize: 28,
  },
  helperOptionText: {
    fontSize: 10,
    color: '#A8C5DD',
    fontWeight: '600',
  },

  /* Register Mode */
  registerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  registerDesc: {
    fontSize: 12,
    color: '#A8C5DD',
    marginBottom: 14,
    lineHeight: 18,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  benefitItem: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  benefitIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 10,
    color: '#A8C5DD',
    fontWeight: '600',
    textAlign: 'center',
  },

  /* Divider */
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    fontSize: 11,
    color: '#6B8BA8',
    fontWeight: '600',
  },

  /* Alternative Auth */
  altAuthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  altAuthButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  altAuthIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  altAuthText: {
    fontSize: 9,
    color: '#A8C5DD',
    fontWeight: '600',
  },

  /* Trust Section */
  trustSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  trustBadge: {
    alignItems: 'center',
    gap: 4,
  },
  trustIcon: {
    fontSize: 24,
  },
  trustLabel: {
    fontSize: 9,
    color: '#A8C5DD',
    fontWeight: '600',
  },

  /* Live Activity */
  liveActivitySection: {
    marginBottom: 16,
  },
  activityCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,255,136,0.2)',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FF88',
  },
  activityTitle: {
    fontSize: 12,
    color: '#00FF88',
    fontWeight: '700',
  },
  activityStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00D4FF',
  },
  statLabel: {
    fontSize: 9,
    color: '#A8C5DD',
    fontWeight: '600',
  },
  dividerVertical: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  /* Emergency Quick Access */
  emergencyQuickAccess: {
    marginBottom: 20,
    borderRadius: 14,
    overflow: 'hidden',
  },
  emergencyInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,45,85,0.3)',
  },
  emergencyQuickIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  emergencyQuickText: {
    flex: 1,
  },
  emergencyQuickTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  emergencyQuickDesc: {
    fontSize: 10,
    color: '#FF8FA3',
    fontWeight: '500',
  },
  emergencyQuickArrow: {
    fontSize: 16,
    color: '#FF2D55',
    fontWeight: '700',
  },

  /* Footer */
  footerSection: {
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  footerText: {
    fontSize: 10,
    color: '#6B8BA8',
    fontWeight: '500',
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerLink: {
    fontSize: 10,
    color: '#6B8BA8',
    fontWeight: '500',
  },
  footerDot: {
    fontSize: 10,
    color: '#6B8BA8',
  },
});
