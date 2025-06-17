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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.spellCard}
      onPress={() => navigation.navigate("SpellDetailScreen", { spell: item, refresh: fetchSpells })}
    >
      <Text style={styles.spellName}>{item.name}</Text>
      <Text style={styles.spellDesc}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.header}>✨ Hechizos de Hogwarts ✨</Text>
      <FlatList
        data={spells}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay hechizos.</Text>
        }
      />
      <ButtonPrimary
        title="Agregar Hechizo"
        onPress={() => navigation.navigate("CreateSpellScreen", { refresh: fetchSpells })}
      />
      <ButtonPrimary
        title="Volver"
        color="#6B7280"
        onPress={() => navigation.goBack()}
      />
      <View style={styles.floatingElements}>
        <Text style={[styles.floatingElement, styles.element1]}>🪄</Text>
        <Text style={[styles.floatingElement, styles.element2]}>✨</Text>
        <Text style={[styles.floatingElement, styles.element3]}>🔮</Text>
        <Text style={[styles.floatingElement, styles.element4]}>⭐</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0a0e27",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#FFD700",
    letterSpacing: 1,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 5,
    borderBottomWidth: 2,
    borderBottomColor: "#FFD700",
    paddingBottom: 8,
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
    paddingHorizontal: 8,
  },
  spellCard: {
    marginBottom: 18,
    backgroundColor: "#2D2E35",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#444",
    elevation: 4,
    shadowColor: "#F5DEB3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginHorizontal: 8,
    padding: 18,
    alignItems: "center",
  },
  spellName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD700",
    letterSpacing: 1,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    marginBottom: 6,
    textAlign: "center",
  },
  spellDesc: {
    fontSize: 16,
    color: "#A0A3B1",
    textAlign: "center",
    marginBottom: 2,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
    marginTop: 20,
  },
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  floatingElement: {
    position: 'absolute',
    fontSize: 22,
    opacity: 0.6,
  },
  element1: {
    top: '15%',
    left: '5%',
    color: '#FFD700',
  },
  element2: {
    top: '30%',
    right: '8%',
    color: '#FFD700',
  },
  element3: {
    bottom: '35%',
    left: '7%',
    color: '#DDA0DD',
  },
  element4: {
    bottom: '20%',
    right: '10%',
    color: '#87CEEB',
  },
});