import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { auth, firestore } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ButtonPrimary from "../components/ButtonPrimary";


export default function SpellsScreen() {
  const [spells, setSpells] = useState([]);
  const navigation = useNavigation();

  const fetchSpells = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    const querySnapshot = await getDocs(collection(firestore, "users", userId, "spells"));
    setSpells(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchSpells();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Mis Hechizos</Text>
        <FlatList
          data={spells}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.spellCard}
              onPress={() => navigation.navigate("SpellDetailScreen", { spell: item, refresh: fetchSpells })}
            >
              <Text style={styles.spellName}>{item.name}</Text>
              <Text style={styles.spellDesc}>{item.description}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={{ textAlign: "center", color: "#6B7280" }}>No hay hechizos.</Text>}
        />
        <ButtonPrimary
          title="Agregar Hechizo"
          onPress={() => navigation.navigate("CreateSpellScreen", { refresh: fetchSpells })}
        />
        <ButtonPrimary
          title="Volver"
          color="#6B7280"
          onPress={() => navigation.goBack()}
        />        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.spellCard}
            onPress={() => navigation.navigate("SpellDetailScreen", { spell: item, refresh: fetchSpells })}
          >
            <Text style={styles.spellName}>{item.name}</Text>
            <Text style={styles.spellDesc}>{item.description}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#181A20",
  },
  container: { flex: 1, padding: 20 },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 20,
    color: "#F5F5F7",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  spellCard: {
    padding: 18,
    backgroundColor: "#23242B",
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#2C2E36",
  },
  spellName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F5F5F7",
    marginBottom: 4,
    textAlign: "center",
  },
  spellDesc: {
    fontSize: 15,
    color: "#A0A3B1",
    textAlign: "center",
  },
});