import React, { useCallback, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { auth, firestore } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

const SEPARATOR_ID = "__separator__";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [generalList, setGeneralList] = useState([]);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      getCharacters();
    }, [])
  );

  const getCharacters = async () => {
    setIsLoading(true);
    try {
      // API
      const URL = 'https://potterapi-fedeperin.vercel.app/es/characters';
      const res = await fetch(URL);
      if (!res.ok) throw new Error("Error al obtener los personajes de la API");
      const apiData = await res.json();

      // Firebase
      const userId = auth.currentUser?.uid;
      let localCharacters = [];
      if (userId) {
        const querySnapshot = await getDocs(collection(firestore, "users", userId, "characters"));
        localCharacters = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          type: "firebase",
        }));
      }

      // Combina en una sola lista con separador
      let combined = [...apiData];
      if (localCharacters.length > 0) {
        combined.push({ id: SEPARATOR_ID, type: "separator" });
        combined = combined.concat(localCharacters);
      }
      setGeneralList(combined);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    if (item.id === SEPARATOR_ID && item.type === "separator") {
      return (
        <Text style={styles.sectionTitle}>New characters</Text>
      );
    }
    if (item.type === "firebase") {
      return (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('DetailsNewCharacterScreen', { character: item, refresh: getCharacters })}
        >
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.title}>{item.fullName}</Text>
        </TouchableOpacity>
      );
    }
    // API character
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('DetailsScreenCharacter', { character: item })}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.title}>{item.fullName}</Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingTitle}>🪄 Cargando Magia... 🪄</Text>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Los retratos están despertando...</Text>
        <View style={styles.sparkles}>
          <Text style={styles.sparkle}>✨</Text>
          <Text style={styles.sparkle}>⭐</Text>
          <Text style={styles.sparkle}>✨</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch(error => alert(error.message));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>🏰 MAGOS DE HOGWARTS 🏰</Text>
      <FlatList
        data={generalList}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={{ textAlign: "center", color: "#888" }}>No hay personajes.</Text>}
      />
      <TouchableOpacity onPress={() => navigation.navigate('CreateCharacter')} style={styles.button}>
        <Text style={styles.buttonText}>Crear Personaje</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SpellsTab')} style={styles.button}>
        <Text style={styles.buttonText}>Ver Hechizos</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleSignOut}
        style={styles.button}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
      <View style={styles.floatingElements}>
          <Text style={[styles.floatingElement, styles.element1]}>🦉</Text>
          <Text style={[styles.floatingElement, styles.element2]}>⚡</Text>
          <Text style={[styles.floatingElement, styles.element3]}>🔮</Text>
          <Text style={[styles.floatingElement, styles.element4]}>✨</Text>
        </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0e27",
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#FFD700", // dorado mágico
    letterSpacing: 1,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 5,
    borderBottomWidth: 2,
    borderBottomColor: "#FFD700",
    paddingBottom: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 18,
    backgroundColor: "#2D2E35",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#444",
    elevation: 4,
    shadowColor: "#F5DEB3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginHorizontal: 8,
  },
  image: {
  width: 160,
  height: 200,
  borderRadius: 18,
  backgroundColor: "#23242B",
  alignSelf: "center",
  marginTop: 8,
  marginBottom: 5,
  resizeMode: "cover",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFD700",
    letterSpacing: 1,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0e27",
    padding: 30,
  },
   loadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#FFD700",
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#A0A3B1",
  },
   sparkles: {
    flexDirection: 'row',
    marginTop: 20,
  },
  sparkle: {
    fontSize: 20,
    color: '#FFD700',
    marginHorizontal: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181A20",
    padding: 20,
  },
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  floatingElement: {
    position: 'absolute',
    fontSize: 22,
    opacity: 0.6,
  },
  errorText: {
    color: "#FF4C4C",
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#7A5CFA", // color mágico púrpura
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
    marginHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 1,
  },
   sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 10,
    textAlign: "center",
    color: "#9A84FF",
    borderBottomWidth: 1,
    borderBottomColor: "#9A84FF",
    letterSpacing: 1,
  },
   element1: {
    top: '15%',
    left: '5%',
    color: '#FFD700',
  },
  element2: {
    top: '30%',
    right: '8%',
    color: '#FFD700',
  },
  element3: {
    bottom: '35%',
    left: '7%',
    color: '#DDA0DD',
  },
  element4: {
    bottom: '20%',
    right: '10%',
    color: '#87CEEB',
  },
});