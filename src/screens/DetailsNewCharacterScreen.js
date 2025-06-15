import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import { auth, firestore } from "../../firebase";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import ButtonPrimary from "../components/ButtonPrimary";

export default function DetailsNewCharacterScreen({ route, navigation }) {
  const { character: initialCharacter, refresh } = route.params;
  const [character, setCharacter] = useState(initialCharacter);

  // Refresca los datos del personaje desde Firestore
  const fetchCharacter = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      const docRef = doc(firestore, "users", userId, "characters", character.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCharacter({ ...docSnap.data(), id: character.id, type: "firebase" });
      }
    } catch (e) {
      // Puedes manejar el error si lo deseas
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
    } catch (error) {
      Alert.alert("Error al eliminar", error.message);
    }
  };

  // Cuando regresas de editar, refresca el personaje
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchCharacter);
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={{ uri: character.image }}
          style={styles.image}
        />
        <Text style={styles.title}>{character.fullName || character.name}</Text>
        <Text style={styles.info}>Apodo: <Text style={styles.infoValue}>{character.nickname || "N/A"}</Text></Text>
        <Text style={styles.info}>Casa: <Text style={styles.infoValue}>{character.hogwartsHouse || "Desconocida"}</Text></Text>
        <Text style={styles.info}>Actor: <Text style={styles.infoValue}>{character.interpretedBy || "N/A"}</Text></Text>
        <Text style={styles.info}>Fecha de nacimiento: <Text style={styles.infoValue}>{character.birthdate || "N/A"}</Text></Text>

        {character.children && character.children.length > 0 && (
          <>
            <Text style={styles.subTitle}>Hijos:</Text>
            {(Array.isArray(character.children) ? character.children : character.children.split(",")).map((child, index) => (
              <Text key={index} style={styles.childItem}>• {child}</Text>
            ))}
          </>
        )}

        <View style={{ marginTop: 24, width: "100%" }}>
          <ButtonPrimary
            title="Editar Personaje"
            onPress={() =>
              navigation.navigate("UpdateCharacterScreen", {
                character,
                refresh: fetchCharacter,
              })
            }
          />
          <ButtonPrimary
            title="Eliminar Personaje"
            color="#FF4C4C"
            onPress={() =>
              Alert.alert(
                "Confirmar",
                "¿Estás seguro de que quieres eliminar este personaje?",
                [
                  { text: "Cancelar", style: "cancel" },
                  { text: "Eliminar", style: "destructive", onPress: handleDelete },
                ]
              )
            }
          />
          <ButtonPrimary
            title="Volver"
            color="#444654"
            onPress={() => navigation.goBack()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#181A20",
  },
  scrollContainer: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#181A20",
  },
  image: {
    width: 160,
    height: 200,
    marginBottom: 24,
    resizeMode: "cover",
    borderRadius: 18,
    backgroundColor: "#23242B",
    alignSelf: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#F5F5F7",
    letterSpacing: 0.5,
    marginTop: 12,
  },
  info: {
    fontSize: 17,
    marginBottom: 8,
    color: "#A0A3B1",
    textAlign: "center",
  },
  infoValue: {
    color: "#F5F5F7",
    fontWeight: "600",
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 18,
    marginBottom: 7,
    color: "#4F8EF7",
    textAlign: "center",
  },
  childItem: {
    fontSize: 16,
    color: "#F5F5F7",
    textAlign: "center",
  },
});