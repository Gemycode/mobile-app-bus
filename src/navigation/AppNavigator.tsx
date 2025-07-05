import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { loadStoredAuth } from '../store/slices/authSlice';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import HomeScreen from '../screens/main/HomeScreen';
import MapScreen from '../screens/main/MapScreen';
import RoutesScreen from '../screens/main/RoutesScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import BusDetailsScreen from '../screens/main/BusDetailsScreen';
import RouteDetailsScreen from '../screens/main/RouteDetailsScreen';

import { Colors } from '../constants/Colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Routes') {
            iconName = focused ? 'bus' : 'bus-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.brandMediumBlue,
        tabBarInactiveTintColor: Colors.gray500,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.gray200,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: Colors.brandDarkBlue,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontFamily: 'Montserrat-Bold',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Routes" component={RoutesScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(loadStoredAuth());
  }, [dispatch]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.brandDarkBlue,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontFamily: 'Montserrat-Bold',
        },
      }}
    >
      {user && token ? (
        <>
          <Stack.Screen 
            name="MainTabs" 
            component={MainTabNavigator} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="BusDetails" 
            component={BusDetailsScreen}
            options={{ title: 'Bus Details' }}
          />
          <Stack.Screen 
            name="RouteDetails" 
            component={RouteDetailsScreen}
            options={{ title: 'Route Details' }}
          />
        </>
      ) : (
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}