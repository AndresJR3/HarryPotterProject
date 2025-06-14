import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';


const Stack = createNativeStackNavigator();

export default function NavigationLogin() {
    return(
    <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Home" component={HomeScreen}/>
    </Stack.Navigator>
    )
}