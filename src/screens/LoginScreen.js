import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { rtdb } from '../api/firestore'; // Imports the Realtime Database instance
import { ref, get, child } from "firebase/database"; // RTDB specific methods

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validation
    if (!phone || !password) {
      Alert.alert("Required", "Please enter both phone number and password.");
      return;
    }

    setLoading(true);
    try {
      // Create reference to the root of the Realtime Database
      const dbRef = ref(rtdb);
      
      // Fetch the specific user node using the phone number as the key
      const snapshot = await get(child(dbRef, `users/${phone}`));

      if (snapshot.exists()) {
        const userData = snapshot.val();

        // Check if password matches in the Realtime Database
        if (userData.password === password) {
          // Success: Navigate to the Safety Hub
          navigation.replace('Home');
        } else {
          Alert.alert("Error", "Invalid password. Please try again.");
        }
      } else {
        Alert.alert("Not Found", "No account found with this phone number in our Realtime Database. Please register.");
      }
    } catch (error) {
      console.error("Login Error: ", error);
      Alert.alert("Connection Error", "Unable to reach the RoadSoS Realtime Database. Please check your internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>RoadSoS</Text>
      <Text style={styles.subtitle}>Intelligent Road Safety Ecosystem</Text>
      
      <View style={styles.form}>
        <TextInput 
          placeholder="Phone Number" 
          placeholderTextColor="#999" // Added: Makes placeholder visible on white
          style={styles.input} 
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          autoCapitalize="none"
        />
        
        <TextInput 
          placeholder="Password" 
          placeholderTextColor="#999" // Added: Makes placeholder visible on white
          style={styles.input} 
          secureTextEntry 
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity 
          style={[styles.loginBtn, loading && { backgroundColor: '#A52A2A' }]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>LOGIN</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.registerLink} 
          onPress={() => navigation.navigate('Register')}
          disabled={loading}
        >
          <Text style={styles.linkText}>Don't have an account? <Text style={styles.bold}>Sign Up</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 30, 
    justifyContent: 'center', 
    backgroundColor: '#fff' 
  },
  logo: { 
    fontSize: 42, 
    fontWeight: 'bold', 
    color: '#D32F2F', 
    textAlign: 'center',
    letterSpacing: 1
  },
  subtitle: { 
    textAlign: 'center', 
    color: '#666', 
    marginBottom: 50,
    fontSize: 14,
    fontWeight: '500'
  },
  form: {
    width: '100%'
  },
  input: { 
    borderBottomWidth: 1, 
    borderColor: '#ddd', 
    marginBottom: 30, 
    padding: 12,
    fontSize: 16,
    color: '#000000', // Added: Forces typed text to be BLACK
    backgroundColor: '#ffffff' // Added: Ensures background is WHITE
  },
  loginBtn: { 
    backgroundColor: '#D32F2F', 
    padding: 18, 
    borderRadius: 12, 
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginTop: 10
  },
  btnText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontWeight: 'bold', 
    fontSize: 16,
    letterSpacing: 0.5
  },
  registerLink: { 
    marginTop: 30, 
    alignItems: 'center' 
  },
  linkText: { 
    color: '#555',
    fontSize: 14
  },
  bold: { 
    color: '#D32F2F', 
    fontWeight: 'bold' 
  }
});