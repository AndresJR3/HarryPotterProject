import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreenCharacter from '../screens/DetailsScreenCharacter';



const Stack = createNativeStackNavigator();

export default function NavigationLogin() {
    return(
    <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="DetailsScreenCharacter" component={DetailsScreenCharacter}/>
    </Stack.Navigator>
    )
}