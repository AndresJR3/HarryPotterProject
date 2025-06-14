import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, TextInput, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { auth } from "../../firebase"

const LoginScreen = () => {

// Definimos state variables for email and password
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const navigation = useNavigation();

useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
            navigation.replace('Home'); // Redirige a Home si el usuario está autenticado
        }
    })
        return () => unsubscribe();
}, []);


// constante para el control del registro de un nuevo usuario
    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Registered with:', user.email);
            })
            .catch(error => alert(error.message));
    }
// constante para el control del inicio de sesion de un usuario
    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Logged in with:', user.email);
            })
            .catch(error => alert(error.message));
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Email"
                    value = { email }
                    onChangeText = {text => setEmail(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Password"
                    secureTextEntry
                    value = { password }
                    onChangeText = {text => setPassword(text)}
                    style={styles.input}
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSignUp} style={[styles.button, styles.buttonOutLine]}>
                    <Text style={styles.buttonOutLineText}>Register</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%',
        marginBottom: 20,
    },
    input:{
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginTop: 10,
    },
    buttonContainer:{
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button:{
        backgroundColor: '#007bff',
        borderRadius: 10,
        paddingVertical: 15,
        width: '100%',
        alignItems: 'center',
    },
    buttonOutLine:{
        backgroundColor: '#fff',
        marginTop: 5,
        borderColor: '#007bff',
        borderWidth: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    }
});
