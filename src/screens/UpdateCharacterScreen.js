import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, SafeAreaView, ScrollView } from "react-native";
import { auth, firestore } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function UpdateCharacterScreen({ route, navigation }) {
  const { character } = route.params;
  const [form, setForm] = useState({
    fullName: character.fullName || "",
    nickname: character.nickname || "",
    hogwartsHouse: character.hogwartsHouse || "",
    interpretedBy: character.interpretedBy || "",
    children: Array.isArray(character.children) ? character.children.join(", ") : character.children || "",
    image: character.image || "",
    birthdate: character.birthdate || "",
  });

  const handleUpdate = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      await updateDoc(
        doc(firestore, "users", userId, "characters", character.id),
        {
          ...form,
          children: form.children ? form.children.split(",").map(c => c.trim()) : [],
        }
      );
      Alert.alert("Personaje actualizado");
      navigation.navigate("Home", { refresh: true });
    } catch (e) {
      Alert.alert("Error al actualizar", e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Editar personaje</Text>
        <TextInput
          style={styles.input}
          value={form.fullName}
          onChangeText={text => setForm(f => ({ ...f, fullName: text }))}
          placeholder="Nombre completo"
        />
        <TextInput
          style={styles.input}
          value={form.nickname}
          onChangeText={text => setForm(f => ({ ...f, nickname: text }))}
          placeholder="Apodo"
        />
        <TextInput
          style={styles.input}
          value={form.hogwartsHouse}
          onChangeText={text => setForm(f => ({ ...f, hogwartsHouse: text }))}
          placeholder="Casa de Hogwarts"
        />
        <TextInput
          style={styles.input}
          value={form.interpretedBy}
          onChangeText={text => setForm(f => ({ ...f, interpretedBy: text }))}
          placeholder="Actor"
        />
        <TextInput
          style={styles.input}
          value={form.children}
          onChangeText={text => setForm(f => ({ ...f, children: text }))}
          placeholder="Hijos (separados por coma)"
        />
        <TextInput
          style={styles.input}
          value={form.image}
          onChangeText={text => setForm(f => ({ ...f, image: text }))}
          placeholder="URL de imagen"
        />
        <TextInput
          style={styles.input}
          value={form.birthdate}
          onChangeText={text => setForm(f => ({ ...f, birthdate: text }))}
          placeholder="Fecha de nacimiento"
        />
        <Button title="Guardar cambios" onPress={handleUpdate} />
        <Button title="Cancelar" color="grey" onPress={() => navigation.goBack()} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { alignItems: "center", padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#333" },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
  },
});