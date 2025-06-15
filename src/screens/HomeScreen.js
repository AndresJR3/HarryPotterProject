import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { auth, firestore } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

const SEPARATOR_ID = "__separator__";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = React.useState(true);
  const [generalList, setGeneralList] = React.useState([]);
  const [error, setError] = React.useState(null);

  useFocusEffect(
    React.useCallback(() => {
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
        localCharacters = querySnapshot.docs.map(doc => doc.data());
      }

      // Combina en una sola lista con separador
      let combined = [...apiData];
      if (localCharacters.length > 0) {
        combined.push({ id: SEPARATOR_ID, type: "separator" });
        combined = combined.concat(localCharacters.map(c => ({ ...c, type: "firebase" })));
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
          onPress={() => navigation.navigate('DetailsNewCharacter', { character: item, refresh: getCharacters })}
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
    backgroundColor: "#fff",
    padding: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    overflow: "hidden",
    borderColor: "#ddd",
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 15,
    textAlign: "center",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
    color: "#007bff",
  },
});