import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  Image, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { rtdb } from '../api/firestore'; // Imports the Realtime Database instance
import { ref, get, child } from "firebase/database"; // RTDB specific methods
// If you are using Expo, change this to: import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Feather'; 

export default function LoginScreen({ navigation }) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!emailOrUsername || !password) {
      Alert.alert("Required", "Please enter both username/email and password.");
      return;
    }

    setLoading(true);
    try {
      const dbRef = ref(rtdb);
      const snapshot = await get(child(dbRef, `users/${emailOrUsername.toLowerCase().replace('.', '_')}`));

      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.password === password) {
          navigation.replace('Home');
        } else {
          Alert.alert("Error", "Invalid password. Please try again.");
        }
      } else {
        Alert.alert("Not Found", "No account found matching this credential. Please register.");
      }
    } catch (error) {
      console.error("Login Error: ", error);
      Alert.alert("Connection Error", "Unable to reach the database. Please check your internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // FIX 1: Explicitly wrapper styles added here to force full screen constraint mapping
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
      style={styles.mainContainer}
    >
      {/* FIX 2: Added contentContainerStyle and verified bounce options */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={true}
        alwaysBounceVertical={true}
      >
        
        {/* Header Illustration Wrapper */}
        <View style={styles.headerContainer}>
          <Image 
            source={require('../../assets/login_bg.png')} 
            style={styles.headerIllustration}
            resizeMode="cover"
          />
        </View>

        {/* Form Body Context */}
        <View style={styles.bodyContainer}>
          <Text style={styles.welcomeTitle}>Welcome Back!</Text>
          <Text style={styles.subtext}>
            Log in to continue your mission and <Text style={styles.highlightText}>make a difference</Text>.
          </Text>

          {/* Form Fields Container */}
          <View style={styles.form}>
            
            {/* Username / Email Input */}
            <View style={styles.inputContainer}>
              <Icon name="user" size={20} color="#E53935" style={styles.inputIcon} />
              <TextInput
                placeholder="Username or Email"
                placeholderTextColor="#A0A0A0"
                style={styles.input}
                value={emailOrUsername}
                onChangeText={setEmailOrUsername}
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#E53935" style={styles.inputIcon} />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#A0A0A0"
                style={styles.input}
                secureTextEntry={secureText}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                <Icon name={secureText ? "eye-off" : "eye"} size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Remember Me & Forgot Password Layout row */}
            <View style={styles.rowActions}>
              <TouchableOpacity style={styles.checkboxRow} onPress={() => setRememberMe(!rememberMe)}>
                <Icon 
                  name={rememberMe ? "check-square" : "square"} 
                  size={18} 
                  color={rememberMe ? "#E53935" : "#666"} 
                />
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => Alert.alert("Reset Password", "Redirect to reset flow.")}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Log In Main Call To Action Button */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && { backgroundColor: '#B71C1C' }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.btnContent}>
                  <Text style={styles.btnText}>Log In</Text>
                  <Icon name="arrow-right" size={20} color="#fff" style={styles.arrowIcon} />
                </View>
              )}
            </TouchableOpacity>

            {/* Divider "or" segment */}
            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.line} />
            </View>

            {/* Alternate Google Authorization Option */}
            <TouchableOpacity style={styles.googleBtn} onPress={() => Alert.alert("Google Sign-In", "Triggering SSO...")}>
              <Text style={styles.googleIconText}>
                <Text style={{color: '#4285F4'}}>G</Text>
                <Text style={{color: '#EA4335'}}>o</Text>
                <Text style={{color: '#FBBC05'}}>o</Text>
                <Text style={{color: '#4285F4'}}>g</Text>
                <Text style={{color: '#34A853'}}>l</Text>
                <Text style={{color: '#EA4335'}}>e</Text>
              </Text>
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Bottom Navigation Toggle Link directly routing to Register Page */}
            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => navigation.navigate('Register')}
              disabled={loading}
            >
              <Text style={styles.linkText}>
                New here? <Text style={styles.boldRed}>Sign Up</Text>
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // FIX 3: Added mainContainer definition to allow layout expanding

  mainContainer: {
    flex: 1,
    backgroundColor: '#FDFDFD',
    height: Platform.OS === 'web' ? '100vh' : '100%',
    overflow: Platform.OS === 'web' ? 'auto' : 'visible',
    position: Platform.OS === 'web' ? 'fixed' : 'relative',
    width: '100%', 
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 60,
  },
  headerContainer: {
    width: '100%',
    height: 320, 
    overflow: 'hidden',
  },
  headerIllustration: {
    width: '100%',
    height: '100%',
  },
  bodyContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtext: {
    textAlign: 'center',
    color: '#555555',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 25,
  },
  highlightText: {
    color: '#E53935',
    fontWeight: '600',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    marginLeft: 8,
    color: '#444',
    fontSize: 14,
  },
  forgotPasswordText: {
    color: '#E53935',
    fontSize: 14,
    fontWeight: '500',
  },
  loginBtn: {
    backgroundColor: '#E53935',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  arrowIcon: {
    position: 'absolute',
    right: 20,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#888888',
    fontSize: 14,
  },
  googleBtn: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: '#FAFAFA',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  googleIconText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  googleBtnText: {
    color: '#333333',
    fontWeight: '600',
    fontSize: 15,
  },
  registerLink: {
    alignItems: 'center',
    marginBottom: 10,
  },
  linkText: {
    color: '#444444',
    fontSize: 15,
  },
  boldRed: {
    color: '#E53935',
    fontWeight: 'bold',
  },
});