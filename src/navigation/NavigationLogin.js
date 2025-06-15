import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreenCharacter from '../screens/DetailsScreenCharacter';
import CreateCharacterScreen from '../screens/CreateCharacterScreen';
import DetailsNewCharacterScreen from '../screens/DetailsNewCharacterScreen';
import UpdateCharacterScreen from '../screens/UpdateCharacterScreen';



const Stack = createNativeStackNavigator();

export default function NavigationLogin() {
    return(
    <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} headerShown={false}/>
        <Stack.Screen name="Home" component={HomeScreen} headerShown={false}/>
        <Stack.Screen name="DetailsScreenCharacter" component={DetailsScreenCharacter} headerShown={false}/>
        <Stack.Screen name="CreateCharacter" component={CreateCharacterScreen} headerShown={false}/>
        <Stack.Screen name="DetailsNewCharacter" component={DetailsNewCharacterScreen} headerShown={false}/>
        <Stack.Screen name="UpdateCharacterScreen" component={UpdateCharacterScreen} headerShown={false}/>
    </Stack.Navigator>
    )
}