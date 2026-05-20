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
import { ref, set, get, child } from "firebase/database"; // RTDB specific methods
// If you are using Expo, change this to: import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Feather'; 

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !mobileNumber || !emailAddress || !password) {
      Alert.alert("Required Fields", "Please populate all fields to create your profile.");
      return;
    }

    if (!agreeTerms) {
      Alert.alert("Terms & Conditions", "You must accept the Terms & Conditions to register as a responder.");
      return;
    }

    setLoading(true);
    try {
      const dbRef = ref(rtdb);
      const accountKey = mobileNumber.trim();
      const snapshot = await get(child(dbRef, `users/${accountKey}`));

      if (snapshot.exists()) {
        Alert.alert("Account Conflict", "This mobile number is already registered inside RoadSoS.");
        setLoading(false);
        return;
      }

      await set(ref(rtdb, `users/${accountKey}`), {
        fullName: fullName.trim(),
        mobileNumber: accountKey,
        emailAddress: emailAddress.trim().toLowerCase(),
        password: password,
        role: "Responder",
        createdAt: new Date().toISOString()
      });

      Alert.alert("Success!", "Account registered successfully!", [
        { text: "OK", onPress: () => navigation.replace('Login') }
      ]);

    } catch (error) {
      console.error("Registration Error: ", error);
      Alert.alert("Registration Failed", "Could not write registration profile node. Please check network state.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
      style={styles.mainContainer}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={true}
        alwaysBounceVertical={true}
      >
        
        {/* Header Illustration Component */}
        <View style={styles.headerContainer}>
          {/* Pointing to your local asset directory */}
          <Image 
            source={require('../../assets/register_bg.png')} 
            style={styles.headerIllustration}
            resizeMode="cover"
          />
        </View>

        {/* Content Body Layout Wrapper */}
        <View style={styles.bodyContainer}>
          <Text style={styles.title}>Register as</Text>
          <Text style={styles.accentTitle}>Responder</Text>
          <Text style={styles.subtext}>Create your account to save lives.</Text>

          {/* Core Registration Input Fields Form */}
          <View style={styles.form}>
            
            {/* Full Name Input Field */}
            <View style={styles.inputContainer}>
              <Icon name="user" size={20} color="#E53935" style={styles.inputIcon} />
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#A0A0A0"
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            {/* Mobile Number Input Field */}
            <View style={styles.inputContainer}>
              <Icon name="phone" size={20} color="#E53935" style={styles.inputIcon} />
              <TextInput
                placeholder="Mobile Number"
                placeholderTextColor="#A0A0A0"
                style={styles.input}
                keyboardType="phone-pad"
                value={mobileNumber}
                onChangeText={setMobileNumber}
              />
            </View>

            {/* Email Address Input Field */}
            <View style={styles.inputContainer}>
              <Icon name="mail" size={20} color="#E53935" style={styles.inputIcon} />
              <TextInput
                placeholder="Email Address"
                placeholderTextColor="#A0A0A0"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={emailAddress}
                onChangeText={setEmailAddress}
              />
            </View>

            {/* Password Input Field */}
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#E53935" style={styles.inputIcon} />
              <TextInput
                placeholder="Create Password"
                placeholderTextColor="#A0A0A0"
                style={styles.input}
                secureTextEntry={secureText}
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                <Icon name={secureText ? "eye-off" : "eye"} size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Interactive Terms and Conditions Checkbox Row */}
            <TouchableOpacity 
              style={styles.termsRow} 
              onPress={() => setAgreeTerms(!agreeTerms)}
              activeOpacity={0.8}
            >
              <Icon 
                name={agreeTerms ? "check-square" : "square"} 
                size={20} 
                color={agreeTerms ? "#E53935" : "#666"} 
              />
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text>
              </Text>
            </TouchableOpacity>

            {/* Registration Call-To-Action Submission Button */}
            <TouchableOpacity
              style={[styles.registerBtn, loading && { backgroundColor: '#B71C1C' }]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.btnContent}>
                  <Text style={styles.btnText}>Register</Text>
                  <Icon name="arrow-right" size={20} color="#fff" style={styles.arrowIcon} />
                </View>
              )}
            </TouchableOpacity>

            {/* Clear Bottom Route Toggle back to Login page view */}
            <TouchableOpacity
              style={styles.loginLinkContainer}
              onPress={() => navigation.navigate('Login')}
              disabled={loading}
            >
              <Text style={styles.loginLinkLabel}>
                Already a responder? <Text style={styles.boldRedText}>Log In</Text>
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Web Scroll Fix Container
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
    height: 260, 
    overflow: 'hidden',
  },
  headerIllustration: {
    width: '100%',
    height: '100%',
  },
  bodyContainer: {
    paddingHorizontal: 24,
    marginTop: 15,
    height: 'auto', // Dynamic stretch calculation on web engines
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111111',
    lineHeight: 36,
  },
  accentTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E53935',
    lineHeight: 36,
    marginBottom: 4,
  },
  subtext: {
    color: '#555555',
    fontSize: 15,
    marginBottom: 25,
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 4,
  },
  termsText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#444444',
  },
  termsLink: {
    color: '#E53935',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  registerBtn: {
    backgroundColor: '#E53935',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
  loginLinkContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  loginLinkLabel: {
    color: '#444444',
    fontSize: 15,
  },
  boldRedText: {
    color: '#E53935',
    fontWeight: 'bold',
  },
});