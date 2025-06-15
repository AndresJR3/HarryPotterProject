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
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Cargando personajes...</Text>
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
      <Text style={styles.headerTitle}>Harry Potter's characters</Text>
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
      <TouchableOpacity onPress={() => navigation.navigate('SpellsScreen')} style={styles.button}>
        <Text style={styles.buttonText}>Ver Hechizos</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleSignOut}
        style={styles.button}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181A20",
    padding: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#F5F5F7",
    letterSpacing: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 18,
    backgroundColor: "#23242B",
    borderRadius: 16,
    overflow: "hidden",
    borderColor: "#2C2E36",
    borderWidth: 1,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  image: {
  width: 160,
  height: 200,
  borderRadius: 18,
  backgroundColor: "#23242B",
  alignSelf: "center",
  marginTop: 16,
  marginBottom: 8,
  resizeMode: "cover",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 16,
    textAlign: "center",
    color: "#F5F5F7",
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181A20",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#A0A3B1",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181A20",
    padding: 20,
  },
  errorText: {
    color: "#FF4C4C",
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4F8EF7",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    marginHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
    color: "#4F8EF7",
    letterSpacing: 0.5,
  },
});