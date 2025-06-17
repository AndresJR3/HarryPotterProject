import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreenCharacter from '../screens/DetailsScreenCharacter';
import CreateCharacterScreen from '../screens/CreateCharacterScreen';
import DetailsNewCharacterScreen from '../screens/DetailsNewCharacterScreen';
import UpdateCharacterScreen from '../screens/UpdateCharacterScreen';

// CRUD Hechizos
import SpellsScreen from '../screens/SpellsScreen';
import CreateSpellScreen from '../screens/CreateSpellScreen';
import SpellDetailScreen from '../screens/SpellDetailScreen';
import UpdateSpellScreen from '../screens/UpdateSpellScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();

export default function NavigationLogin() {
    const Tab = createBottomTabNavigator();

    function SpellsTabNavigator() {
        return (
            <Tab.Navigator screenOptions={{ headerShown: false }}>
                <Tab.Screen name="SpellsScreen" component={SpellsScreen} />
                <Tab.Screen name="CreateSpellScreen" component={CreateSpellScreen} />
                <Tab.Screen name="SpellDetailScreen" component={SpellDetailScreen} />
                <Tab.Screen name="UpdateSpellScreen" component={UpdateSpellScreen} />
            </Tab.Navigator>
        );
    }

    return (
    <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="DetailsScreenCharacter" component={DetailsScreenCharacter} options={{ headerShown: false }}/>
        <Stack.Screen name="CreateCharacter" component={CreateCharacterScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="DetailsNewCharacterScreen" component={DetailsNewCharacterScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="UpdateCharacterScreen" component={UpdateCharacterScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="SpellsScreen" component={SpellsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CreateSpellScreen" component={CreateSpellScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SpellDetailScreen" component={SpellDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UpdateSpellScreen" component={UpdateSpellScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
    )
}