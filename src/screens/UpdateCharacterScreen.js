import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text, TextInput, StyleSheet, Alert } from "react-native";
import { auth, firestore } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import ButtonPrimary from "../components/ButtonPrimary";

export default function UpdateCharacterScreen({ route, navigation }) {
  const { character, refresh } = route.params;
  const [form, setForm] = useState({
    fullName: character.fullName || "",
    nickname: character.nickname || "",
    hogwartsHouse: character.hogwartsHouse || "",
    interpretedBy: character.interpretedBy || "",
    children: Array.isArray(character.children)
      ? character.children.join(", ")
      : character.children || "",
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
          fullName: form.fullName,
          nickname: form.nickname,
          hogwartsHouse: form.hogwartsHouse,
          interpretedBy: form.interpretedBy,
          children: typeof form.children === "string"
            ? form.children.split(",").map(c => c.trim()).filter(Boolean)
            : [],
          image: form.image,
          birthdate: form.birthdate,
        }
      );
      Alert.alert("Personaje actualizado");
      if (refresh) refresh();
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error al actualizar", e.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Editar personaje</Text>
        <Text style={styles.label}>Nombre completo</Text>
        <TextInput
          style={styles.input}
          value={form.fullName}
          onChangeText={text => setForm(f => ({ ...f, fullName: text }))}
          placeholder="Nombre completo"
          placeholderTextColor="#A0A3B1"
        />
        <Text style={styles.label}>Apodo</Text>
        <TextInput
          style={styles.input}
          value={form.nickname}
          onChangeText={text => setForm(f => ({ ...f, nickname: text }))}
          placeholder="Apodo"
          placeholderTextColor="#A0A3B1"
        />
        <Text style={styles.label}>Casa de Hogwarts</Text>
        <TextInput
          style={styles.input}
          value={form.hogwartsHouse}
          onChangeText={text => setForm(f => ({ ...f, hogwartsHouse: text }))}
          placeholder="Casa de Hogwarts"
          placeholderTextColor="#A0A3B1"
        />
        <Text style={styles.label}>Actor</Text>
        <TextInput
          style={styles.input}
          value={form.interpretedBy}
          onChangeText={text => setForm(f => ({ ...f, interpretedBy: text }))}
          placeholder="Actor"
          placeholderTextColor="#A0A3B1"
        />
        <Text style={styles.label}>Hijos (separados por coma)</Text>
        <TextInput
          style={styles.input}
          value={form.children}
          onChangeText={text => setForm(f => ({ ...f, children: text }))}
          placeholder="Hijos (separados por coma)"
          placeholderTextColor="#A0A3B1"
        />
        <Text style={styles.label}>URL de imagen</Text>
        <TextInput
          style={styles.input}
          value={form.image}
          onChangeText={text => setForm(f => ({ ...f, image: text }))}
          placeholder="URL de imagen"
          placeholderTextColor="#A0A3B1"
        />
        <Text style={styles.label}>Fecha de nacimiento</Text>
        <TextInput
          style={styles.input}
          value={form.birthdate}
          onChangeText={text => setForm(f => ({ ...f, birthdate: text }))}
          placeholder="Fecha de nacimiento"
          placeholderTextColor="#A0A3B1"
        />
        <ButtonPrimary title="Guardar cambios" onPress={handleUpdate} />
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