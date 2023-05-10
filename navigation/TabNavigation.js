import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { enableScreens } from 'react-native-screens';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../components/HomeScreen';
import HistoryScreen from '../components/HistoryScreen';
import SightingsScreen from '../components/SightingsScreen';

const Tab = createBottomTabNavigator();
enableScreens();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <MaterialCommunityIcons name="home-roof" size={size} color={color} />;
          } else if (route.name === 'History') {
            return <MaterialCommunityIcons name="history" size={size} color={color} />;
          } else if (route.name === 'New Sightings') {
            return <MaterialCommunityIcons name="binoculars" size={size} color={color} />;
          }
        },
        headerShown: false,
        tabBarActiveTintColor: '#2b4e73',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: {
          display: 'flex',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="New Sightings" component={SightingsScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigation;