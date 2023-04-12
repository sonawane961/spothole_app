import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

// pages
import HomeScreen from './screens/HomeScreen'
import GettingStartedScreen from './screens/GettingStartedScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import EventDetailScreen from './screens/EventDetailsScreen'
import AppInfoScreen from './screens/AppInfoScreen'
import ProfileScreen from './screens/ProfileScreen'

const Stack = createStackNavigator()

export default function App() {
  const globalScreenOptions = {
    headerShown: false,
  }
  return (
    <NavigationContainer>
      <StatusBar style='light' />
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Start' component={GettingStartedScreen} />  
        <Stack.Screen name='Onboard' component={OnboardingScreen} />
        <Stack.Screen name='Event' component={EventDetailScreen} />
        <Stack.Screen name='AppInfo' component={AppInfoScreen} />
        <Stack.Screen name='Profile' component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
