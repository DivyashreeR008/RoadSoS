import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Added for the dropdown
import { rtdb } from '../api/firestore'; 
import { ref, set } from "firebase/database"; 

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ fullName: '', phone: '', bloodGroup: '', password: '' });
  const [loading, setLoading] = useState(false);

  // List of Blood Groups
  const bloodGroups = ["Select Blood Group", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const handleRegister = async () => {
    // Validation
    if (!form.phone || !form.password || form.bloodGroup === '' || form.bloodGroup === "Select Blood Group" || !form.fullName) {
      Alert.alert("Error", "All fields are required for the Safety Ecosystem.");
      return;
    }

    setLoading(true);

    try {
      const userRef = ref(rtdb, 'users/' + form.phone); 
      
      await set(userRef, {
        fullName: form.fullName,
        phone: form.phone,
        bloodGroup: form.bloodGroup,
        password: form.password, 
        createdAt: new Date().toISOString()
      });

      setLoading(false);
      
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
        placeholderTextColor="#999"
        style={styles.input} 
        onChangeText={t => setForm({...form, fullName: t})} 
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput 
        placeholder="Phone Number" 
        placeholderTextColor="#999"
        style={styles.input} 
        keyboardType="phone-pad" 
        onChangeText={t => setForm({...form, phone: t})} 
      />

      <Text style={styles.label}>Blood Group</Text>
      {/* DROPDOWN IMPLEMENTATION */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.bloodGroup}
          onValueChange={(itemValue) => setForm({...form, bloodGroup: itemValue})}
          style={styles.picker}
          dropdownIconColor="#D32F2F"
        >
          {bloodGroups.map((group, index) => (
            <Picker.Item key={index} label={group} value={group} color={index === 0 ? "#999" : "#000"} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Password</Text>
      <TextInput 
        placeholder="Password" 
        placeholderTextColor="#999"
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
    fontSize: 16,
    color: '#000', // Visibility fix for Dark Mode
    backgroundColor: '#fff' 
  },
  pickerContainer: {
    borderBottomWidth: 1.5,
    borderColor: '#ccc',
    marginBottom: 25,
    justifyContent: 'center'
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#000' // Visibility fix
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