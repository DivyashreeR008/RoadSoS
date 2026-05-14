import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { rtdb } from '../api/firestore';
import { ref, set } from "firebase/database"; // Correctly using Realtime Database methods


export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ fullName: '', phone: '', bloodGroup: '', password: '' });
  const [loading, setLoading] = useState(false);


  const handleRegister = async () => {
    // Validation for essential safety data
    if (!form.phone || !form.password || !form.bloodGroup || !form.fullName) {
      Alert.alert("Error", "All fields are required for the Safety Ecosystem.");
      return;
    }


    setLoading(true);


    try {
      // 1. Create a reference to the user's phone number in the Realtime Database tree
      // The path will be 'users/PHONE_NUMBER'
      const userRef = ref(rtdb, 'users/' + form.phone);
     
      // 2. Save the user data and Digital Emergency Health Profile to RTDB
      await set(userRef, {
        fullName: form.fullName,
        phone: form.phone,
        bloodGroup: form.bloodGroup,
        password: form.password, // Note: In production, passwords should be hashed
        createdAt: new Date().toISOString()
      });


      setLoading(false);
     
      // 3. Success Feedback and Navigation
      Alert.alert(
        "Registration Successful",
        "User saved to Realtime Database. You can now login.",
        [{ text: "Login", onPress: () => navigation.navigate('Login') }]
      );


    } catch (error) {
      setLoading(false);
      console.error("RTDB Error: ", error);
      Alert.alert("Registration Failed", error.message);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>RoadSoS Signup</Text>
     
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        placeholder="Enter Full Name"
        style={styles.input}
        onChangeText={t => setForm({...form, fullName: t})}
      />


      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        placeholder="Phone Number"
        style={styles.input}
        keyboardType="phone-pad"
        onChangeText={t => setForm({...form, phone: t})}
      />


      <Text style={styles.label}>Blood Group</Text>
      <TextInput
        placeholder="e.g. O+, AB-"
        style={styles.input}
        autoCapitalize="characters"
        onChangeText={t => setForm({...form, bloodGroup: t})}
      />


      <Text style={styles.label}>Password</Text>
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        onChangeText={t => setForm({...form, password: t})}
      />
     
      <TouchableOpacity
        style={[styles.btn, loading && { backgroundColor: '#A52A2A' }]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>REGISTER</Text>
        )}
      </TouchableOpacity>


      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={styles.linkContainer}
      >
        <Text style={styles.linkText}>Already have an account? <Text style={styles.boldText}>Login</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 25,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 30,
    textAlign: 'center'
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginBottom: 5
  },
  input: {
    borderBottomWidth: 1.5,
    borderColor: '#ccc',
    marginBottom: 25,
    padding: 10,
    fontSize: 16
  },
  btn: {
    backgroundColor: '#D32F2F',
    padding: 18,
    borderRadius: 12,
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18
  },
  linkContainer: {
    marginTop: 25,
    alignItems: 'center'
  },
  linkText: {
    fontSize: 14,
    color: '#555'
  },
  boldText: {
    color: '#D32F2F',
    fontWeight: 'bold'
  }
});



