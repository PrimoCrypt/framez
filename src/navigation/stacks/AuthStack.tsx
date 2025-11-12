import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "../../screens/auth/SignInScreen";
import SignUpScreen from "../../screens/auth/SignUpScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: "Sign In" }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: "Create Account" }} />
    </Stack.Navigator>
  );
}
