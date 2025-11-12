import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/context/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
      <SafeAreaView></SafeAreaView>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
