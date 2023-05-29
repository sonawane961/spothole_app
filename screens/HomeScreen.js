import Pubnub from 'pubnub';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Button,
} from 'react-native';
import { Ionicons, SimpleLineIcons, Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
// import { host } from '../ip';

const pubnub = new Pubnub({
  publishKey: 'pub-c-fc2bfb00-7232-4340-82b1-1efc6a1f7d41',
  subscribeKey: 'sub-c-9d7dc568-e522-4355-b3d2-072d63d4c442',
  userId: 'myUniqueUserId',
});

export default function HomeScreen({ route, navigation }) {
  const [messages, setMessages] = useState([]);

  const [activeItem, setActiveItem] = useState('home');

  const [mapRegion, setmapRegion] = useState({
    latitude: 19.0303,
    longitude: 72.8384,
    latitudeDelta: 0.0722,
    longitudeDelta: 0.0791,
  });
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 19.075983,
    longitude: 72.877655,
  });
  const [otherLocation1, setOtherLocation1] = useState({
    latitude: 19.0173,
    longitude: 72.8531,
  });
  const [otherLocation2, setOtherLocation2] = useState({
    latitude: 19.0456,
    longitude: 72.8254,
  });
  const [otherLocation3, setOtherLocation3] = useState({
    latitude: 19.0244,
    longitude: 72.8191,
  });
  // const [otherLocation4, setOtherLocation4] = useState({
  //   latitude: 19.0148,
  //   longitude: 72.8531,
  // });
  const [otherLocation5, setOtherLocation5] = useState({
    latitude: 19.0395,
    longitude: 72.8472,
  });

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [eventName, setEventName] = useState('Raj Thakare Rally ');
  const [personnel, setPersonnel] = useState('');
  const [event, setEvent] = useState(null);
  // const [text, onChangeText] = useState([]);

  useEffect(() => {
    const showMessage = (msg) => {
      setMessages((messages) => [...messages, msg]);
    };

    // add listener
    const listener = {
      status: (statusEvent) => {
        if (statusEvent.category === 'PNConnectedCategory') {
          console.log('Connected');
        }
      },
      message: (messageEvent) => {
        showMessage(messageEvent.message.description);
      },
      presence: (presenceEvent) => {
        // handle presence
      },
    };
    pubnub.addListener(listener);
    // cleanup listener
    return () => {
      pubnub.removeListener(listener);
    };
  }, [pubnub, setMessages]);

  // publish message
  const publishMessage = async (message) => {
    // With the right payload, you can publish a message, add a reaction to a message,
    // send a push notification, or send a small payload called a signal.
    const publishPayload = {
      channel: event?._id,
      message: {
        title: 'greeting',
        description: {
          from: personnel?._id,
          message: currentLocation,
        },
      },
    };
    await pubnub.publish(publishPayload);
  };

  const MINUTE_MS = 60000;

  useEffect(() => {
    const interval = setInterval(() => {
      publishMessage('hello');
    }, MINUTE_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [])

  useEffect(() => {
    // subscribe to a channel
    // console.log(event);
    if (event && event._id) {
      // console.log(event._id);
      // console.log(personnel._id);
      pubnub.subscribe({
        channels: [event._id],
      });
      // cleanup subscription
      return () => {
        pubnub.unsubscribe({
          channels: [event._id],
        });
      };
    }
  }, [pubnub, event]);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  const handleEvent = () => {
    setActiveItem('event');
    navigation.navigate('Event', { event: event });
  };

  const handleProfile = () => {
    setActiveItem('search');
    navigation.navigate('Profile', { profile: personnel });
  };

  useEffect(() => {
    // Request permission to access location
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let id = route?.params?.id_number;

      const data = await axios.get(`${host}/api/personnel/detail/${id}`);
      // console.log(data.data.personnel)
      setPersonnel(data.data.personnel);

      let event_id = data.data.current_event[0].event;

      const event_data = await axios.get(
        `${host}/api/events/${event_id}`
      );

      setmapRegion({
        latitude: event_data.data.event.location.coordinates[0],
        longitude: event_data.data.event.location.coordinates[1]
      })
      setEventName(event_data.data.event.name);
      setEvent(event_data.data.event);
      console.log(event_data.data.event);

      // Enable background location tracking
      await Location.startLocationUpdatesAsync('backgroundLocationTask', {
        accuracy: Location.Accuracy.High,
        timeInterval: 300000,
        distanceInterval: 10,
        deferredUpdatesInterval: 1000,
        deferredUpdatesDistance: 1,
        foregroundService: {
          notificationTitle: 'Background location tracking',
          notificationBody:
            'We are tracking your location in the background',
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
          });

          let distance = calculateDistance(
            mapRegion.latitude,
            mapRegion.longitude,
            currentLocation?.coords?.latitude,
            currentLocation?.coords?.longitude
          );

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
        title: '🚨️ You are Far away from your Post 🚨️',
        body: `Distance: ${~~distance | 0} m`,
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

  const [showModal, setShowModal] = useState(false);

  const notifications = [
    { id: 1, title: 'Raj Thakare Rally 🚩️', description: 'MNS chief Raj Thackeray trained his guns at Maharashtra chief minister Eknath Shinde from the Shivaji Parkafter.' },
    { id: 2, title: 'Kolkata Didi Speech 🐯️', description: 'West Bengal chief minister Mamata Banerjee on Tuesday said that she will hold a protest from March 29 noon to March 30' },
    { id: 3, title: 'Pappu Party Prachar 🧒️', description: 'Disqualified for elections :/' },
  ];

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar style='dark' />
      <View style={styles.mapContainer}>
        <MapView
          style={{ alignSelf: 'stretch', height: '100%' }}
          region={mapRegion}
        >
          <Marker
            coordinate={mapRegion}
            style={{ height: 40, width: 40 }}
            title='Allocated Location'
          ></Marker>
          <Marker coordinate={currentLocation} title='Your location'>
            <Image
              source={require('../assets/pin.png')}
              style={{ width: 70, height: 70 }}
            />
          </Marker>
          <Marker coordinate={otherLocation1} title='PotHoles'>
            <Image
              source={require('../assets/pin.png')}
              style={{ width: 60, height: 60 }}
            />
          </Marker>
          <Marker coordinate={otherLocation2} title='PotHoles'>
            <Image
              source={require('../assets/pin.png')}
              style={{ width: 60, height: 60 }}
            />
          </Marker>
          <Marker coordinate={otherLocation3} title='PotHoles'>
            <Image
              source={require('../assets/pin.png')}
              style={{ width: 60, height: 60 }}
            />
          </Marker>
          {/* <Marker coordinate={otherLocation4} title='PotHoles'>
            <Image
              source={require('../assets/pin.png')}
              style={{ width: 60, height: 60 }}
            />
          </Marker> */}
          <Marker coordinate={otherLocation5} title='PotHoles'>
            <Image
              source={require('../assets/pin.png')}
              style={{ width: 60, height: 60 }}
            />
          </Marker>
          <Circle
            center={mapRegion}
            radius={2500}
            fillColor='rgba(0, 105, 0, 0.3)'
            strokeColor='rgba(0, 255, 0, 0.5)'
            strokeWidth={2}
          />
        </MapView>
      </View>
      <View style={styles.topContainer}>
        <View style={styles.searchContainer}>
          <Ionicons
            name='md-location-sharp'
            size={24}
            color='#181829'
            style={styles.searchIcon}
          />
          <Text style={styles.searchInput}>SpotHole Detector 🛣️</Text>
          {/* <Ionicons name="chevron-down" size={24} color="black" style={styles.downIcon} /> */}
        </View>
        <TouchableOpacity
          style={styles.filterIcon}
          onPress={() => setShowModal(true)}
        >
          <Feather name='bell' size={24} color='black' />
          <View style={styles.notificationDot}></View>
        </TouchableOpacity>
      </View>
      {showModal && (
        <View style={styles.modal}>
          <TouchableOpacity onPress={() => setShowModal(false)}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: 'Poppins', fontSize: 24, fontWeight: '600', width: 200, justifyContent: 'space-between' }}> 🔔️ Activity</Text>
              <Feather name='x' size={30} color='red' style={{ alignSelf: 'center' }} />
            </View>
          </TouchableOpacity>

          <View style={styles.notList}>
            {notifications.map((notification) => (
              <View style={styles.notCard} key={notification.id}>
                <Text style={styles.notTitle}>{notification.title}</Text>
                <Text style={styles.notDescription}>{notification.description}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      <View style={styles.bottomContainer}>
        <View style={styles.bottomNavigationContainer}>
          <View style={styles.bottomNavigation}>
            <TouchableOpacity
              style={[
                styles.bottomNavigationItem,
                activeItem === 'home' &&
                styles.bottomNavigationItemActive,
              ]}
              onPress={() => setActiveItem('home')}
            >
              <Ionicons
                name='ios-compass-outline'
                size={30}
                color={
                  activeItem === 'home'
                    ? '#FFFFFF'
                    : '#AAAAAA'
                }
              />
              {activeItem === 'home' && (
                <View style={styles.activeDot} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.bottomNavigationItem,
                activeItem === 'event' &&
                styles.bottomNavigationItemActive,
              ]}
              onPress={handleEvent}
            >
              <SimpleLineIcons
                name='event'
                size={20}
                color={
                  activeItem === 'event'
                    ? '#FFFFFF'
                    : '#AAAAAA'
                }
                style={{ paddingBottom: 2 }}
              />
              {activeItem === 'event' && (
                <View style={styles.activeDot} />
              )}
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={[
                styles.bottomNavigationItem,
                activeItem === 'search' &&
                styles.bottomNavigationItemActive,
              ]}
              onPress={handleProfile}
            >
              <Ionicons
                name='person-outline'
                size={24}
                color={
                  activeItem === 'search'
                    ? '#FFFFFF'
                    : '#AAAAAA'
                }
              />
              {activeItem === 'search' && (
                <View style={styles.activeDot} />
              )}
            </TouchableOpacity> */}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('AppInfo')}
        >
          <View style={styles.goButton}>
            <Image
              style={styles.logo}
              source={require('../assets/splash.png')}
            />
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

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
    alignSelf: 'center',
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
    paddingVertical: '2%',
    width: '90%'
  },
  filterIcon: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    height: 50,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 18,
    backgroundColor: 'red',
    width: 7,
    height: 7,
    borderRadius: 5,
  },
  bottomContainer: {
    width: '85%',
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
    height: 85,
    width: 85,
  },
  modal: {
    position: 'absolute',
    top: '12%',
    right: '12%',
    width: '75%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notList: {
    flex: 1,
    padding: 10,
  },
  notCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  notTitle: {
    fontFamily: 'Raleway',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  notDescription: {
    fontFamily: 'Poppins',
    fontSize: 14,
  },
});
