import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
import TaskApp from "./components/TodoList";

export default function App() {
  return (
    <View style={styles.container}>
      <TaskApp />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100vw",
    height: "100vh",
    backgroundColor: "#AFEEEE",
    alignItems: "center",
    justifyContent: "center",
  },
});
