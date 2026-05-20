// src/screens/MapScreen.native.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

const GOOGLE_MAPS_APIKEY = 'AIzaSyC7QXvbCzaEpRK5IvF0h6KVepzJst_DEsw'; 

export default function MapScreen() {
  const [mapLoading, setMapLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [routeCoords, setRouteCoords] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Location access is needed.");
        setMapLoading(false);
        return;
      }
      try {
        let userLocation = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = userLocation.coords;
        setLocation({ 
            latitude, 
            longitude, 
            latitudeDelta: 0.02, 
            longitudeDelta: 0.02 
        });
        fetchNearbyServices(latitude, longitude);
      } catch (error) {
        console.error(error);
      } finally {
        setMapLoading(false);
      }
    })();
  }, []);

  const fetchNearbyServices = async (lat, lng) => {
    const types = ['hospital', 'police', 'car_repair']; 
    let allFound = [];
    for (const type of types) {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=${type}&key=${GOOGLE_MAPS_APIKEY}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results) {
          const formatted = data.results.map(p => ({
            id: p.place_id,
            name: p.name,
            type: type,
            address: p.vicinity,
            icon: type === 'hospital' ? '🏥' : type === 'police' ? '👮' : '🛠️',
            coordinate: { latitude: p.geometry.location.lat, longitude: p.geometry.location.lng }
          }));
          allFound = [...allFound, ...formatted];
        }
      } catch (e) { console.error(e); }
    }
    setNearbyPlaces(allFound);
  };

  const getRoute = async (destLat, destLng) => {
    if (!location) return;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${location.latitude},${location.longitude}&destination=${destLat},${destLng}&key=${GOOGLE_MAPS_APIKEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const points = decodePolyline(data.routes[0].overview_polyline.points);
        setRouteCoords(points);
        mapRef.current?.animateToRegion({
            latitude: destLat,
            longitude: destLng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
        }, 1000);
      }
    } catch (e) { console.error(e); }
  };

  const decodePolyline = (t) => {
    let e = [], r = 0, o = 0, n = 0;
    while (r < t.length) {
      let s, u = 0, c = 0;
      do { s = t.charCodeAt(r++) - 63, c |= (31 & s) << u, u += 5; } while (s >= 32);
      let f = 1 & c ? ~(c >> 1) : c >> 1; o += f, u = 0, c = 0;
      do { s = t.charCodeAt(r++) - 63, c |= (31 & s) << u, u += 5; } while (s >= 32);
      let h = 1 & c ? ~(c >> 1) : c >> 1; n += h, e.push({ latitude: o / 1e5, longitude: n / 1e5 });
    }
    return e;
  };

  if (mapLoading) return (
    <View style={styles.center}>
        <ActivityIndicator size="large" color="#D32F2F" />
        <Text style={{ color: '#333', marginTop: 10 }}>Accessing Rescue Map...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef} 
        provider={PROVIDER_GOOGLE} 
        style={styles.map} 
        initialRegion={location} 
        showsUserLocation={true}
        loadingEnabled={true}
        cacheEnabled={false}
      >
        {location && <Marker coordinate={location} title="Your Location" pinColor="blue" />}
        
        {nearbyPlaces.map(place => (
          <Marker 
            key={place.id} 
            coordinate={place.coordinate} 
            title={place.name} 
            onPress={() => getRoute(place.coordinate.latitude, place.coordinate.longitude)}
          >
              <View style={styles.customMarker}>
                  <Text style={{ fontSize: 20 }}>{place.icon}</Text>
              </View>
          </Marker>
        ))}
        
        {routeCoords.length > 0 && <Polyline coordinates={routeCoords} strokeWidth={5} strokeColor="#D32F2F" />}
      </MapView>

      <View style={styles.reportPanel}>
        <Text style={styles.reportTitle}>Emergency Services Nearby</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {nearbyPlaces.map((place) => (
                <TouchableOpacity 
                    key={place.id} 
                    style={styles.placeCard}
                    onPress={() => getRoute(place.coordinate.latitude, place.coordinate.longitude)}
                >
                    <Text style={styles.placeIcon}>{place.icon}</Text>
                    <View>
                        <Text style={styles.placeName} numberOfLines={1}>{place.name}</Text>
                        <Text style={styles.placeType}>{place.type.replace('_', ' ')}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { width: '100%', height: '75%' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  customMarker: { backgroundColor: 'white', padding: 5, borderRadius: 20, elevation: 5, borderWidth: 1, borderColor: '#D32F2F' },
  reportPanel: { height: '25%', backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 15, elevation: 10 },
  reportTitle: { fontSize: 18, fontWeight: 'bold', color: '#D32F2F', marginBottom: 10 },
  placeCard: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 12, marginRight: 10, width: 200, height: 70, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  placeIcon: { fontSize: 24, marginRight: 10 },
  placeName: { fontSize: 14, fontWeight: '600', color: '#333', width: 140 },
  placeType: { fontSize: 12, color: '#D32F2F', textTransform: 'capitalize' }
});