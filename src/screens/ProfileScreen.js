import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, ActivityIndicator, ScrollView } from 'react-native';
// Switch to Realtime Database as per your RegisterScreen logic
import { rtdb } from '../api/firestore';
import { ref, get, update } from "firebase/database";


export default function ProfileScreen() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    fullName: '',      // Added: From Registration
    phone: 'default_user', // This should ideally come from your Auth state
    bloodGroup: '',    // Added: From Registration
    allergies: '',  
    conditions: ''  
  });


  // Load existing profile from RoadSoS RTDB on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Change "default_user" to the actual registered phone number if available
        const userPhone = profile.phone;
        const dbRef = ref(rtdb, `users/${userPhone}`);
        const snapshot = await get(dbRef);
       
        if (snapshot.exists()) {
          const data = snapshot.val();
          setProfile(prev => ({
            ...prev,
            fullName: data.fullName || '',
            bloodGroup: data.bloodGroup || '',
            phone: data.phone || prev.phone,
            allergies: data.allergies || '',
            conditions: data.conditions || ''
          }));
        }
      } catch (e) {
        console.error("Error loading profile:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);


  const saveProfile = async () => {
    if (!profile.bloodGroup) {
      Alert.alert("Required", "Please enter your blood group for emergency use.");
      return;
    }


    setLoading(true);
    try {
      // Updates the existing user node in Realtime Database
      const userRef = ref(rtdb, `users/${profile.phone}`);
      await update(userRef, {
        ...profile,
        lastUpdated: new Date().toISOString()
      });
      Alert.alert("Success", "Digital Health Profile synced to RoadSoS ecosystem.");
    } catch (e) {
      console.error(e);
      Alert.alert("Sync Error", "Could not save to cloud. Profile saved locally.");
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#D32F2F" />
        <Text style={{color: '#333'}}>Accessing Health Records...</Text>
      </View>
    );
  }


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Digital Emergency Health Profile</Text>
      <Text style={styles.subtitle}>These details are shared with responders during an SOS.</Text>
     
      {/* DISPLAY NAME (Registered) */}
      <Text style={styles.label}>Registered Full Name</Text>
      <TextInput
        style={[styles.input, styles.readOnly]}
        value={profile.fullName}
        editable={false} // Prevents changing the registered name here
      />


      {/* BLOOD GROUP (Registered/Editable) */}
      <Text style={styles.label}>Blood Group</Text>
      <TextInput
        placeholder="e.g. O+"
        placeholderTextColor="#999"
        style={styles.input}
        value={profile.bloodGroup}
        onChangeText={(text) => setProfile({...profile, bloodGroup: text})}
      />


      <Text style={styles.label}>Known Allergies</Text>
      <TextInput
        placeholder="e.g. Penicillin"
        placeholderTextColor="#999"
        style={styles.input}
        value={profile.allergies}
        onChangeText={(text) => setProfile({...profile, allergies: text})}
      />


      <Text style={styles.label}>Existing Medical Conditions</Text>
      <TextInput
        placeholder="e.g. Asthma, Diabetes"
        placeholderTextColor="#999"
        style={[styles.input, styles.multiline]}
        value={profile.conditions}
        onChangeText={(text) => setProfile({...profile, conditions: text})}
        multiline
      />


      <View style={{ marginBottom: 40 }}>
        <Button
          title="Update Emergency Profile"
          color="#D32F2F"
          onPress={saveProfile}
        />
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { padding: 25, backgroundColor: '#fff', flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  subtitle: { fontSize: 13, color: '#666', marginBottom: 25 },
  label: { fontSize: 14, fontWeight: '600', color: '#D32F2F', marginBottom: 5 },
  input: {
    borderBottomWidth: 1,
    borderColor: '#CCC',
    marginBottom: 25,
    padding: 8,
    fontSize: 16,
    color: '#000', // Visibility fix
    backgroundColor: '#fff'
  },
  readOnly: {
    color: '#777',
    borderBottomColor: '#eee'
  },
  multiline: { height: 80, textAlignVertical: 'top' }
});



