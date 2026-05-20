// src/screens/MapScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MapScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Map Not Supported on Web</Text>
      <Text style={styles.subtitle}>
        The RoadSoS Rescue Map uses native Google Maps SDK. 
        Please use the **Expo Go** mobile app to view nearby services and routes.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#D32F2F', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 10 }
});
