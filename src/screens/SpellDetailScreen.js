import React from "react";
import { SafeAreaView, View, Text, Alert, StyleSheet } from "react-native";
import { auth, firestore } from "../../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import ButtonPrimary from "../components/ButtonPrimary";

export default function SpellDetailScreen({ route, navigation }) {
  const { spell, refresh } = route.params;

  const handleDelete = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      await deleteDoc(doc(firestore, "users", userId, "spells", spell.id));
      Alert.alert("Hechizo eliminado");
      if (refresh) refresh();
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error al eliminar", e.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>{spell.name}</Text>
        <Text style={styles.desc}>{spell.description}</Text>
        <ButtonPrimary
          title="Editar"
          onPress={() => navigation.navigate("UpdateSpellScreen", { spell, refresh })}
        />
        <ButtonPrimary
          title="Eliminar"
          color="#FF4C4C"
          onPress={() =>
            Alert.alert(
              "Confirmar",
              "¿Eliminar este hechizo?",
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#181A20",
  },
  container: { flex: 1, padding: 24 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 20,
    color: "#F5F5F7",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  desc: { fontSize: 17, color: "#A0A3B1", marginBottom: 20, textAlign: "center" },
});