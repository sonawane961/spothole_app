import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView } from 'react-native';
import { Ionicons, SimpleLineIcons, Feather } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
import { host } from '../ip';

export default function HomeScreen({ route, navigation }) {

  const handleEvent = () => {
    setActiveItem('event');
    navigation.navigate('Event', {event: event});
  }

  const handleProfile = () => {
    setActiveItem('search');
    navigation.navigate('Profile', { profile: personnel });
  }

  const [activeItem, setActiveItem] = useState('home');

  const [mapRegion, setmapRegion] = useState({
    latitude: 19.0303,
    longitude: 72.8384,
    latitudeDelta: 0.0722,
    longitudeDelta: 0.0791,
  });
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 19.075983,
    longitude: 72.877655
  });
  const [otherLocation1, setOtherLocation1] = useState({
    latitude: 19.0173,
    longitude: 72.8531
  });
  const [otherLocation2, setOtherLocation2] = useState({
    latitude: 19.0456,
    longitude: 72.8254
  });
  const [otherLocation3, setOtherLocation3] = useState({
    latitude: 19.0244,
    longitude: 72.8191
  });
  const [otherLocation4, setOtherLocation4] = useState({
    latitude: 19.0148,
    longitude: 72.8531
  });
  const [otherLocation5, setOtherLocation5] = useState({
    latitude: 19.0395,
    longitude: 72.8472
  });

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [eventName, setEventName] = useState('');
  const [personnel, setPersonnel] = useState('');
  const [event, setEvent] = useState('');

  useEffect(() => {
    // Request permission to access location
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let id = route.params.id_number

      const data = await axios.get(`${host}/api/personnel/detail/${id}`);
      // console.log(data.data.personnel)
      setPersonnel(data.data.personnel)

      let event_id = data.data.current_event[0].event

      const event_data = await axios.get(`${host}/api/events/${event_id}`);
      setEventName(event_data.data.event.name)
      setEvent(event_data.data.event)
      console.log(event_data.data.event)

      // Enable background location tracking
      await Location.startLocationUpdatesAsync('backgroundLocationTask', {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
        deferredUpdatesInterval: 1000,
        deferredUpdatesDistance: 1,
        foregroundService: {
          notificationTitle: 'Background location tracking',
          notificationBody: 'We are tracking your location in the background',
          notificationColor: '#ffffff',
        },
      });

      // Get current location
      let currentLocation = await Location.getLastKnownPositionAsync({});
      setLocation(currentLocation);

      // Subscribe to location updates
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 50000,
          distanceInterval: 10,
          mayShowUserSettingsDialog: true,
        },
        (newLocation) => {
          setCurrentLocation({
            latitude: currentLocation?.coords?.latitude,
            longitude: currentLocation?.coords?.longitude,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.0091,
          })

          let distance = calculateDistance(mapRegion.latitude, mapRegion.longitude, currentLocation?.coords?.latitude, currentLocation?.coords?.longitude);
          // console.log(distance);
          // console.log(currentLocation?.coords?.lat);
          setLocation(newLocation);
          if (distance > 2500) {
            sendNotification(distance);
          }
        }
      );
    })();

    return () => {
      // Stop location updates
      Location.stopLocationUpdatesAsync('backgroundLocationTask');
    };
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const sendNotification = async (distance) => {
    try {
      const notificationContent = {
        title: 'You are Far away from your Post',
        body: `Distance: ${distance} m`,
        sound: 'default',
      };
      // console.log(notificationContent);
      const trigger = new Date();
      trigger.setSeconds(trigger.getSeconds() + 1);
      await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: trigger,
      });
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
    } catch (error) {
      console.log(`Error sending notification: ${error}`);
    }
  };

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.mapContainer}>
        <MapView
          style={{ alignSelf: 'stretch', height: '100%' }}
          region={mapRegion}
        >
          <Marker coordinate={mapRegion}
            style={{ height: 40, width: 40 }}
            title="Allocated Location">
          </Marker>
          <Marker
            coordinate={currentLocation}
            title="Your location"
          >
            <Image
              source={require('../assets/location_current.png')}
              style={{ width: 70, height: 70 }}
            />
          </Marker>
          <Marker
            coordinate={otherLocation1}
            title="Officers"
          >
            <Image
              source={require('../assets/location_other.png')}
              style={{ width: 60, height: 60 }}
            />
          </Marker>
          <Marker
            coordinate={otherLocation2}
            title="Officers"
          >
            <Image
              source={require('../assets/location_other.png')}
              style={{ width: 60, height: 60 }}
            />
          </Marker>
          <Marker
            coordinate={otherLocation3}
            title="Officers"
          >
            <Image
              source={require('../assets/location_other.png')}
              style={{ width: 60, height: 60 }}
            />
          </Marker>
          <Marker
            coordinate={otherLocation4}
            title="Officers"
          >
            <Image
              source={require('../assets/location_other.png')}
              style={{ width: 60, height: 60 }}
            />
          </Marker>
          <Marker
            coordinate={otherLocation5}
            title="Officers"
          >
            <Image
              source={require('../assets/location_other.png')}
              style={{ width: 60, height: 60 }}
            />
          </Marker>
          <Circle
            center={mapRegion}
            radius={2500}
            fillColor="rgba(0, 105, 0, 0.3)"
            strokeColor="rgba(0, 255, 0, 0.5)"
            strokeWidth={2}
          />
        </MapView>
      </View>
      <View style={styles.topContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="md-location-sharp" size={24} color="#181829" style={styles.searchIcon} />
          <Text style={styles.searchInput}>{eventName}
          </Text>
          {/* <Ionicons name="chevron-down" size={24} color="black" style={styles.downIcon} /> */}
        </View>
        <TouchableOpacity
          style={styles.filterIcon}
        >
          <Feather name="bell" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.bottomNavigationContainer}>
          <View style={styles.bottomNavigation}>
            <TouchableOpacity
              style={[styles.bottomNavigationItem, activeItem === 'home' && styles.bottomNavigationItemActive]}
              onPress={() => setActiveItem('home')}
            >
              <Ionicons name="ios-compass-outline" size={30} color={activeItem === 'home' ? '#FFFFFF' : '#AAAAAA'} />
              {activeItem === 'home' && <View style={styles.activeDot} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bottomNavigationItem, activeItem === 'event' && styles.bottomNavigationItemActive]}
              onPress={handleEvent}
            >
              <SimpleLineIcons name="event" size={20} color={activeItem === 'event' ? '#FFFFFF' : '#AAAAAA'} style={{ paddingBottom: 2 }} />
              {activeItem === 'event' && <View style={styles.activeDot} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bottomNavigationItem, activeItem === 'search' && styles.bottomNavigationItemActive]}
              onPress={handleProfile}
            >
              <Ionicons name="person-outline" size={24} color={activeItem === 'search' ? '#FFFFFF' : '#AAAAAA'} />
              {activeItem === 'search' && <View style={styles.activeDot} />}
            </TouchableOpacity>


          </View>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('AppInfo')}>
          <View style={styles.goButton}>
            <Image style={styles.logo} source={require('../assets/logo.png')} />
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    top: '5%',
  },
  searchContainer: {
    // justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderColor: '#ddd',
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 20,
    width: '70%',
  },
  searchIcon: {
    marginRight: 10,
    alignSelf: 'center'
  },
  downIcon: {
    alignSelf: 'center',
    marginLeft: 10,
  },
  searchInput: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    alignSelf: 'center',
    paddingRight: '5%',
    paddingVertical: '2%'
  },
  filterIcon: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    marginHorizontal: 10,
    padding: 10,
    height: 50
  },
  bottomContainer: {
    width: '100%',
    height: 75,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    bottom: '2.5%',
  },
  bottomNavigationContainer: {
    justifyContent: 'center',
    width: '60%',
    height: 70,
    backgroundColor: '#181829',
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  bottomNavigationItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNavigationText: {
    fontFamily: 'Poppins',
    fontSize: 12,
    marginTop: 5,
    color: '#FFF',
  },
  bottomNavigationTextActive: {
    color: '#FFFFFF',
  },
  activeDot: {
    height: 4,
    width: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    marginTop: 2,
  },
  goButton: {
    backgroundColor: '#181829',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 45,
  },
  logo: {
    height: 100,
    width: 100,
  },
});





