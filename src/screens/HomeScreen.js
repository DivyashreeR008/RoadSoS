import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { rtdb } from '../api/firestore'; // Using the RTDB instance you configured
import { ref, onValue, limitToLast, query } from "firebase/database"; // Correct RTDB imports

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [safetyStatus, setSafetyStatus] = useState("AI analyzing: Speed, Braking, Movement");
  const [riskZone, setRiskZone] = useState("Scanning for high-risk zones...");

  useEffect(() => {
    // 1. Create a reference to 'safety_insights' in Realtime Database
    const insightsRef = ref(rtdb, 'safety_insights');
    
    // 2. Set up a Realtime listener
    const unsubscribe = onValue(insightsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        
        // Realtime Database returns an object of objects, we get the most recent entry
        const keys = Object.keys(data);
        const lastKey = keys[keys.length - 1];
        const latestInsight = data[lastKey];

        if (latestInsight.alert) {
          setSafetyStatus(`Warning: ${latestInsight.alert} detected!`);
          setRiskZone(`Risk Zone: ${latestInsight.locationName}`);
        }
      }
    }, (error) => {
      console.log("Offline mode active or Permission denied.");
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <ScrollView style={styles.mainContainer} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>RoadSoS Dashboard</Text>
      
      {/* 1. Medium Size SOS Button - Now centered and streamlined */}
      <View style={styles.sosContainer}>
        <TouchableOpacity 
          style={styles.sosButton} 
          onPress={() => navigation.navigate('Emergency')}
        >
          <Text style={styles.sosText}>SOS</Text>
          <Text style={styles.sosSubtext}>Press to Call for Help</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Feature Cards Grid */}
      <View style={styles.grid}>
        
        {/* Live Monitoring Card */}
        <View style={[styles.card, styles.fullWidth]}>
          <Text style={styles.cardTitle}>🛡️ Predictive Safety</Text>
          <Text style={styles.cardStatus}>{safetyStatus}</Text>
          <Text style={styles.riskSubtext}>{riskZone}</Text>
        </View>

        {/* Rescue Map Card */}
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Map')}>
          <Text style={styles.emoji}>📍</Text>
          <Text style={styles.cardTitleSmall}>Rescue Map</Text>
          <Text style={styles.cardDesc}>Nearby Ambulances & Hospitals</Text>
        </TouchableOpacity>

        {/* Medical ID Card */}
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.emoji}>🚑</Text>
          <Text style={styles.cardTitleSmall}>Medical ID</Text>
          <Text style={styles.cardDesc}>Digital Health Profile</Text>
        </TouchableOpacity>

        {/* Community/HackHive Insights */}
        <View style={[styles.card, styles.fullWidth, { backgroundColor: '#E3F2FD' }]}>
          <Text style={styles.cardTitle}>🎙️ Voice Activation</Text>
          <Text style={styles.cardStatus}>Active: Listening for "Help"</Text>
        </View>

      </View>

      <Text style={styles.footerNote}>Always wear your seatbelt. Drive safe.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  contentContainer: { padding: 20, paddingBottom: 40 },
  header: { fontSize: 24, fontWeight: '800', marginBottom: 20, color: '#1A1A1A', marginTop: 10 },
  
  // SOS Button Section
  sosContainer: { alignItems: 'center', marginBottom: 25 },
  sosButton: { 
    backgroundColor: '#D32F2F', 
    width: 140, 
    height: 140, 
    borderRadius: 70, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 6,
    borderWidth: 4,
    borderColor: '#FFCDD2'
  },
  sosText: { color: 'white', fontWeight: 'bold', fontSize: 28 },
  sosSubtext: { color: 'white', fontSize: 10, opacity: 0.9 },

  // Grid Layout
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  fullWidth: { width: '100%' },
  card: { 
    width: (width / 2) - 30, 
    backgroundColor: 'white', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  // Card Content
  emoji: { fontSize: 24, marginBottom: 8 },
  cardTitle: { fontWeight: 'bold', color: '#2E7D32', fontSize: 16, marginBottom: 8 },
  cardTitleSmall: { fontWeight: '700', color: '#333', fontSize: 14, marginBottom: 4 },
  cardStatus: { fontSize: 14, color: '#444', lineHeight: 20 },
  cardDesc: { fontSize: 11, color: '#777' },
  riskSubtext: { fontSize: 12, color: '#D32F2F', marginTop: 8, fontWeight: '600' },
  
  footerNote: { marginTop: 20, fontSize: 12, color: '#AAA', textAlign: 'center', fontStyle: 'italic' }
});
