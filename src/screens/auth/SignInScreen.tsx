import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { Button, Input } from "../../components/ui";
import Logo from "../../components/Logo";
import { colors } from "../../theme/colors";

export default function SignInScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    try {
      setErr(null);
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Logo size="lg" />
      </View>
      
      <View style={styles.form}>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={styles.input}
        />
        
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        
        {err ? <Text style={styles.error}>{err}</Text> : null}
        
        <Button
          title="Sign In"
          onPress={signIn}
          variant="primary"
          loading={loading}
          disabled={loading}
          style={styles.button}
        />
        
        <Button
          title="Create account"
          onPress={() => navigation.navigate("SignUp")}
          variant="secondary"
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: "center",
    padding: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  form: {
    width: "100%",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 12,
  },
  error: {
    color: colors.status.error,
    marginBottom: 16,
    fontSize: 14,
    textAlign: "center",
  },
});