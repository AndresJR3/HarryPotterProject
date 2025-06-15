import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert, TextInput, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { auth, firestore } from "../../firebase";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";

// Generador simple de IDs únicos
const uuid = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

const CHARACTER_FIELDS = {
  fullName: "",
  nickname: "",
  hogwartsHouse: "",
  interpretedBy: "",
  children: "",
  image: "",
  birthdate: "",
};

const CreateCharacterScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [characters, setCharacters] = useState([]);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ ...CHARACTER_FIELDS });

  useEffect(() => {
    fetchAllCharacters();
  }, []);

  // Obtiene personajes del API y de Firestore y los combina
  const fetchAllCharacters = async () => {
    setIsLoading(true);
    try {
      // 1. API
      const apiRes = await fetch("https://potterapi-fedeperin.vercel.app/es/characters");
      if (!apiRes.ok) throw new Error("Error al obtener los personajes del API");
      const apiCharacters = await apiRes.json();

      // 2. Firestore (personajes creados por el usuario)
      const userId = auth.currentUser?.uid;
      let localCharacters = [];
      if (userId) {
        const querySnapshot = await getDocs(collection(firestore, "users", userId, "characters"));
        localCharacters = querySnapshot.docs.map(doc => doc.data());
      }

      // 3. Combina ambos
      setCharacters([...apiCharacters, ...localCharacters]);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  // Guarda personaje en Firestore
  const saveCharacterToFirebase = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert("Debes iniciar sesión para guardar personajes.");
      return;
    }
    // Validación simple
    if (!form.fullName || !form.image) {
      Alert.alert("Completa al menos el nombre y la imagen.");
      return;
    }
    try {
      const newId = uuid();
      const characterData = {
        ...form,
        id: newId,
        children: form.children ? form.children.split(",").map(c => c.trim()) : [],
      };
      await setDoc(
        doc(collection(firestore, "users", userId, "characters"), newId),
        characterData
      );
      setForm({ ...CHARACTER_FIELDS });
      Alert.alert("Personaje creado correctamente.");
      navigation.navigate("Home", { refresh: true });
      fetchAllCharacters();
    } catch (error) {
      Alert.alert("Error al guardar: " + error.message);
    }
  };

  const renderCharacter = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.fullName || item.name}</Text>
      <Text style={styles.info}>Apodo: {item.nickname || "N/A"}</Text>
      <Text style={styles.info}>Casa: {item.hogwartsHouse || "N/A"}</Text>
      <Text style={styles.info}>Actor: {item.interpretedBy || "N/A"}</Text>
      <Text style={styles.info}>Nacimiento: {item.birthdate || "N/A"}</Text>
      {item.children && item.children.length > 0 && (
        <Text style={styles.info}>Hijos: {Array.isArray(item.children) ? item.children.join(", ") : item.children}</Text>
      )}
    </View>
  );

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Solo el formulario va en ScrollView */}
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Crear nuevo personaje</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={form.fullName}
            onChangeText={text => setForm(f => ({ ...f, fullName: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Apodo"
            value={form.nickname}
            onChangeText={text => setForm(f => ({ ...f, nickname: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Casa de Hogwarts"
            value={form.hogwartsHouse}
            onChangeText={text => setForm(f => ({ ...f, hogwartsHouse: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Actor"
            value={form.interpretedBy}
            onChangeText={text => setForm(f => ({ ...f, interpretedBy: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Hijos (separados por coma)"
            value={form.children}
            onChangeText={text => setForm(f => ({ ...f, children: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="URL de imagen"
            value={form.image}
            onChangeText={text => setForm(f => ({ ...f, image: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Fecha de nacimiento"
            value={form.birthdate}
            onChangeText={text => setForm(f => ({ ...f, birthdate: text }))}
          />
          <TouchableOpacity style={styles.saveButton} onPress={saveCharacterToFirebase}>
            <Text style={styles.saveButtonText}>Crear personaje</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Text style={styles.header}>Lista de personajes</Text>
      <FlatList
        data={characters}
        renderItem={renderCharacter}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

export default CreateCharacterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    color: "#333",
  },
  form: {
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
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
    alignItems: "center",
    padding: 10,
  },
  image: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
    textAlign: "center",
    color: "#333",
  },
  info: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 2,
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "700",
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
});