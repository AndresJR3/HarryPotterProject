import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text, TextInput, StyleSheet, Alert } from "react-native";
import { auth, firestore } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import ButtonPrimary from "../components/ButtonPrimary";

export default function CreateSpellScreen({ route, navigation }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const refresh = route.params?.refresh;

  const handleCreate = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      await addDoc(collection(firestore, "users", userId, "spells"), {
        name,
        description,
      });
      Alert.alert("Hechizo creado");
      if (refresh) refresh();
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Nuevo Hechizo</Text>
        <Text style={styles.label}>Nombre del hechizo</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nombre del hechizo"
          placeholderTextColor="#A0A3B1"
        />
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Descripción"
          placeholderTextColor="#A0A3B1"
        />
        <ButtonPrimary title="Crear" onPress={handleCreate} />
        <ButtonPrimary title="Cancelar" color="#444654" onPress={() => navigation.goBack()} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#181A20",
  },
  container: {
    flexGrow: 1,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#181A20",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 24,
    color: "#F5F5F7",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: 4,
    marginBottom: 2,
    fontSize: 15,
    color: "#A0A3B1",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#23242B",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2C2E36",
    fontSize: 16,
    color: "#F5F5F7",
    width: "100%",
  },
});