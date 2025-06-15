import React, { useState } from "react";
import { View, Text, Image, Button, StyleSheet, SafeAreaView, ScrollView, TextInput, Alert } from "react-native";
import { auth, firestore } from "../../firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function DetailsNewCharacterScreen({ route, navigation }) {
  const { character, refresh } = route.params;
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...character });

  const handleUpdate = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      await updateDoc(
        doc(firestore, "users", userId, "characters", character.id),
        {
          ...form,
          children: form.children ? (Array.isArray(form.children) ? form.children : form.children.split(",").map(c => c.trim())) : [],
        }
      );
      Alert.alert("Personaje actualizado");
      setEditMode(false);
      if (refresh) refresh();
    } catch (e) {
      Alert.alert("Error al actualizar", e.message);
    }
  };

  const handleDelete = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      await deleteDoc(doc(firestore, "users", userId, "characters", character.id));
      Alert.alert("Personaje eliminado");
      if (refresh) refresh();
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error al eliminar", e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={{ uri: form.image }} style={styles.image} />
        {editMode ? (
          <>
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
              value={Array.isArray(form.children) ? form.children.join(", ") : form.children}
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
            <Button title="Cancelar" color="grey" onPress={() => setEditMode(false)} />
          </>
        ) : (
          <>
            <Text style={styles.title}>{form.fullName}</Text>
            <Text style={styles.info}>Apodo: {form.nickname || "N/A"}</Text>
            <Text style={styles.info}>Casa: {form.hogwartsHouse || "Desconocida"}</Text>
            <Text style={styles.info}>Actor: {form.interpretedBy || "N/A"}</Text>
            <Text style={styles.info}>Fecha de nacimiento: {form.birthdate || "N/A"}</Text>
            {form.children && form.children.length > 0 && (
              <>
                <Text style={styles.subTitle}>Hijos:</Text>
                {(Array.isArray(form.children) ? form.children : form.children.split(",")).map((child, index) => (
                  <Text key={index} style={styles.childItem}>• {child}</Text>
                ))}
              </>
            )}
            <Button title="Editar" onPress={() => navigation.navigate("UpdateCharacterScreen", { character: form })} />
            <Button title="Eliminar" color="red" onPress={handleDelete} />
          </>
        )}
        <Button title="Volver" onPress={() => navigation.goBack()} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: "80%",
    height: 300,
    marginBottom: 20,
    resizeMode: "contain",
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
    color: "#444",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
    color: "#222",
    textAlign: "center",
  },
  childItem: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
  },
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