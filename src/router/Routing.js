import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import Scan from '../screens/components/Scan';
import Submit from '../screens/components/Submit';
import Success from '../screens/components/Success';
import ScanArea from '../screens/components/ScanArea';
import Stats from '../screens/IOT/Stats';

const Stack = createNativeStackNavigator();

export default function Router() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Scan" component={Scan} />
        <Stack.Screen name="Stats" component={Stats} />
        <Stack.Screen name="Submit" component={Submit} />
        <Stack.Screen name="Success" component={Success} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
