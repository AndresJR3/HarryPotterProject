import React from "react";
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View, StyleSheet, Dimensions } from "react-native";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/native"; 
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigation = useNavigation(); 

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        navigation.replace("Home"); 
      }
    });
    return unsubscribe;
  }, []);

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Registered with: ', user.email);
        navigation.replace("Home"); 
      })
      .catch(error => alert(error.message));
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with: ', user.email);
        navigation.replace("Home"); 
      })
      .catch(error => alert(error.message));
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior="padding"
      > 
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.mainTitle}>⚡ HOGWARTS ⚡</Text>
            <Text style={styles.subTitle}>Escuela de Magia y Hechicería</Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>🦉 Correo Mágico</Text>
              <TextInput
                placeholder="tu-email@hogwarts.com"
                placeholderTextColor="#ffd700"
                value={email}
                onChangeText={text => setEmail(text)}
                style={styles.magicalInput}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>🔐 Contraseña Secreta</Text>
              <TextInput
                placeholder="Expecto Patronum..."
                placeholderTextColor="#ffd700"
                value={password}
                onChangeText={text => setPassword(text)}
                style={styles.magicalInput}
                secureTextEntry
              />
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={handleLogin}
              style={styles.loginButton}
            >
              <LinearGradient
                colors={['##8C9B2A', '#6657C7', '#ED5353']}
                style={styles.buttonGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
              >
                <Text style={styles.loginButtonText}>🪄 ¡ENTRAR AL CASTILLO! 🪄</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSignUp}
              style={styles.signupButton}
            >
              <LinearGradient
                colors={['#3742fa', '#2f3542', '#57606f']}
                style={styles.buttonGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
              >
                <Text style={styles.signupButtonText}>📜 SER UN NUEVO MAGO 📜</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={styles.footerContainer}>
            <Text style={styles.footerHouse}>🏰 Gryffindor • Hufflepuff • Ravenclaw • Slytherin 🏰</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  star: {
    position: 'absolute',
    fontSize: 18,
    opacity: 0.9,
  },
  star1: {
    top: '12%',
    left: '15%',
    color: '#ffd700',
  },
  star2: {
    top: '20%',
    right: '20%',
    color: '#ff6b6b',
  },
  star3: {
    top: '35%',
    left: '8%',
    color: '#3742fa',
  },
  star4: {
    bottom: '35%',
    right: '12%',
    color: '#ffd700',
  },
  star5: {
    bottom: '20%',
    left: '20%',
    color: '#ff6b6b',
  },
  star6: {
    bottom: '12%',
    right: '25%',
    color: '#3742fa',
  },
  contentContainer: {
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 18,
    color: '#ffd700',
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.9,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: "#ffd700",
    textAlign: "center",
    textShadowColor: '#000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
    letterSpacing: 3,
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    fontStyle: 'italic',
    opacity: 0.8,
    marginBottom: 12,
  },
  titleUnderline: {
    width: 100,
    height: 3,
    backgroundColor: '#ffd700',
    borderRadius: 2,
  },
  formContainer: {
    width: '100%',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: "#ffd700",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    marginLeft: 4,
  },
  magicalInput: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    color: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 25,
    fontSize: 16,
    fontWeight: '500',
    borderWidth: 2,
    borderColor: '#ffd700',
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButton: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: "#ff6b6b",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  signupButton: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: "#3742fa",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  loginButtonText: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 1,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  signupButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 1,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  footerContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerHouse: {
    color: "#fff",
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
    fontStyle: 'italic',
  },
  floatingIcons: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  floatingIcon: {
    position: 'absolute',
    fontSize: 24,
    opacity: 0.6,
  },
  icon1: {
    top: '25%',
    left: '5%',
  },
  icon2: {
    top: '40%',
    right: '8%',
  },
  icon3: {
    bottom: '30%',
    left: '10%',
  },
  icon4: {
    bottom: '45%',
    right: '5%',
  },
});