import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { auth } from "../../firebase"; // Importa la configuración de Firebase

const HomeScreen = () => {
    const navigation = useNavigation();

    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                navigation.replace('Login'); // Redirige a Login después de cerrar sesión
            })
            .catch(error => alert(error.message));
    }
    
    return (
        <View style={styles.container}>
            <Text> Email: {auth.currentUser?.email}</Text>
            <TouchableOpacity
            onPress={handleSignOut}
            style={styles.button}>
                
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View> 
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    text: {
        fontSize: 20,
        color: '#333',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});