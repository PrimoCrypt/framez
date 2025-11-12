import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./stacks/AuthStack";
import MainTab from "./tabs/MainTab";
import { useAuth } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={MainTab} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}