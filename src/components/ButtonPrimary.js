// ButtonPrimary.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function ButtonPrimary({ title, onPress, color = "#4F8EF7", style }) {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: color }, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
    width: "90%",
    alignSelf: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
});