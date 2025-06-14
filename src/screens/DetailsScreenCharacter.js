import React from "react";
import { View, Text, Image, Button, StyleSheet, SafeAreaView, ScrollView, } from "react-native";

export default function DetailsScreenCharacter({ route, navigation }) {
  const { character } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={{ uri: character.image }}
          style={styles.image}
        />
        <Text style={styles.title}>{character.fullName || character.name}</Text>
        <Text style={styles.info}>Apodo: {character.nickname || "N/A"}</Text>
        <Text style={styles.info}>Casa: {character.hogwartsHouse || "Desconocida"}</Text>
        <Text style={styles.info}>Actor: {character.interpretedBy || "N/A"}</Text>
        <Text style={styles.info}>Fecha de nacimiento: {character.birthdate || "N/A"}</Text>

        {character.children && character.children.length > 0 && (
          <>
            <Text style={styles.subTitle}>Hijos:</Text>
            {character.children.map((child, index) => (
              <Text key={index} style={styles.childItem}>• {child}</Text>
            ))}
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
});

