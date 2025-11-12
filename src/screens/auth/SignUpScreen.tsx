import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../lib/firebase";
import { Button, Input } from "../../components/ui";
import Logo from "../../components/Logo";
import { colors } from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function SignUpScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!res.canceled && res.assets && res.assets.length > 0) {
      setPhotoURL(res.assets[0].uri);
    }
  };

  const signUp = async () => {
    try {
      setErr(null);
      setLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email.trim(), password);
      
      let finalPhotoURL = photoURL;
      
      if (photoURL && !photoURL.startsWith("http")) {
        const response = await fetch(photoURL);
        const blob = await response.blob();
        const fileRef = ref(storage, `profiles/${res.user.uid}/${Date.now()}`);
        await uploadBytes(fileRef, blob);
        finalPhotoURL = await getDownloadURL(fileRef);
      }

      await updateProfile(res.user, {
        displayName,
        photoURL: finalPhotoURL || undefined,
      });
      
      await setDoc(doc(db, "users", res.user.uid), {
        displayName,
        email: res.user.email,
        photoURL: finalPhotoURL || null,
        createdAt: serverTimestamp(),
      });
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
      
      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={50} color={colors.text.muted} />
            </View>
          )}
          <View style={styles.editIconContainer}>
            <Ionicons name="camera" size={20} color={colors.accent.gold} />
          </View>
        </TouchableOpacity>
        <Text style={styles.avatarHint}>Tap to add profile picture</Text>
      </View>
      
      <View style={styles.form}>
        <Input
          placeholder="Name"
          value={displayName}
          onChangeText={setDisplayName}
          style={styles.input}
        />
        
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
          title="Sign Up"
          onPress={signUp}
          variant="primary"
          loading={loading}
          disabled={loading}
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
    marginBottom: 32,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.accent.gold,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.background.secondary,
    borderWidth: 3,
    borderColor: colors.accent.gold,
    justifyContent: "center",
    alignItems: "center",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.background.secondary,
    borderRadius: 18,
    padding: 6,
    borderWidth: 2,
    borderColor: colors.accent.gold,
  },
  avatarHint: {
    color: colors.text.muted,
    fontSize: 12,
    marginTop: 4,
  },
  form: {
    width: "100%",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  error: {
    color: colors.status.error,
    marginBottom: 16,
    fontSize: 14,
    textAlign: "center",
  },
});
