import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Alert, ScrollView } from 'react-native';
import { db } from '../api/firestore'; // Firebase connection
import { doc, setDoc, getDoc } from "firebase/firestore";


export default function SettingsScreen() {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isOfflineEnabled, setIsOfflineEnabled] = useState(true);
  const [isAnonymizedDataEnabled, setIsAnonymizedDataEnabled] = useState(true);


  // Load user preferences from the RoadSoS ecosystem
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const docRef = doc(db, "settings", "default_user");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setIsVoiceEnabled(data.voiceSOS);
          setIsOfflineEnabled(data.offlineSMS);
          setIsAnonymizedDataEnabled(data.anonymizedInsights);
        }
      } catch (e) {
        console.log("Using local default settings.");
      }
    };
    loadSettings();
  }, []);


  // Update preferences in the database
  const updateSetting = async (key, value) => {
    try {
      await setDoc(doc(db, "settings", "default_user"), {
        voiceSOS: key === 'voice' ? value : isVoiceEnabled,
        offlineSMS: key === 'offline' ? value : isOfflineEnabled,
        anonymizedInsights: key === 'data' ? value : isAnonymizedDataEnabled,
      }, { merge: true });
    } catch (e) {
      Alert.alert("Sync Error", "Settings saved locally only.");
    }
  };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Emergency Controls</Text>
     
      {/* 1. Voice-Activated SOS System */}
      <View style={styles.row}>
        <View style={styles.textContainer}>
          <Text style={styles.label}>Voice Activated SOS</Text>
          <Text style={styles.subLabel}>Triggers on commands like "Help" or "Accident" </Text>
        </View>
        <Switch
          value={isVoiceEnabled}
          onValueChange={(val) => {
            setIsVoiceEnabled(val);
            updateSetting('voice', val);
          }}
          trackColor={{ true: '#D32F2F' }}
        />
      </View>


      {/* 2. Offline Emergency Functionality */}
      <View style={styles.row}>
        <View style={styles.textContainer}>
          <Text style={styles.label}>Offline SMS Fallback</Text>
          <Text style={styles.subLabel}>Sends last known GPS via SMS in low-signal areas </Text>
        </View>
        <Switch
          value={isOfflineEnabled}
          onValueChange={(val) => {
            setIsOfflineEnabled(val);
            updateSetting('offline', val);
          }}
          trackColor={{ true: '#D32F2F' }}
        />
      </View>


      <Text style={styles.sectionTitle}>Community & Insights</Text>


      {/* 3. Data-Driven Road Safety Insights */}
      <View style={styles.row}>
        <View style={styles.textContainer}>
          <Text style={styles.label}>Anonymized Safety Insights</Text>
          <Text style={styles.subLabel}>Help authorities identify high-risk zones [cite: 44]</Text>
        </View>
        <Switch
          value={isAnonymizedDataEnabled}
          onValueChange={(val) => {
            setIsAnonymizedDataEnabled(val);
            updateSetting('data', val);
          }}
          trackColor={{ true: '#D32F2F' }}
        />
      </View>


      <View style={styles.footer}>
        <Text style={styles.footerText}>RoadSoS v1.0.0</Text>
        <Text style={styles.footerText}>Part of the Integrated Rescue Ecosystem [cite: 34]</Text>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9', padding: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#D32F2F', textTransform: 'uppercase', marginBottom: 15, marginTop: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 1
  },
  textContainer: { flex: 0.85 },
  label: { fontSize: 16, fontWeight: '600', color: '#333' },
  subLabel: { fontSize: 12, color: '#777', marginTop: 4 },
  footer: { marginTop: 30, alignItems: 'center', paddingBottom: 40 },
  footerText: { fontSize: 12, color: '#AAA' }
});
