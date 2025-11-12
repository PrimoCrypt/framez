import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc, collection, query, where, getDocs, writeBatch } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { Button, Input } from "../components/ui";
import { colors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import ScreenHeader from "../components/ScreenHeader";

interface EditProfileScreenProps {
  onClose: () => void;
}

export default function EditProfileScreen({ onClose }: EditProfileScreenProps) {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState<string | null>(user?.photoURL || null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let newPhotoURL = photoURL;

      if (photoURL && photoURL !== user.photoURL && !photoURL.startsWith("http")) {
        setUploadingImage(true);
        const response = await fetch(photoURL);
        const blob = await response.blob();
        const fileRef = ref(storage, `profiles/${user.uid}/${Date.now()}`);
        await uploadBytes(fileRef, blob);
        newPhotoURL = await getDownloadURL(fileRef);
        setUploadingImage(false);
      }

      const finalDisplayName = displayName.trim();
      const finalPhotoURL = newPhotoURL || user.photoURL || null;

      await updateProfile(user, {
        displayName: finalDisplayName,
        photoURL: finalPhotoURL,
      });

      await updateDoc(doc(db, "users", user.uid), {
        displayName: finalDisplayName,
        photoURL: finalPhotoURL,
      });

      try {
        const postsQuery = query(
          collection(db, "posts"),
          where("authorId", "==", user.uid)
        );
        const postsSnapshot = await getDocs(postsQuery);
        
        if (!postsSnapshot.empty) {
          const batch = writeBatch(db);
          postsSnapshot.forEach((postDoc) => {
            batch.update(postDoc.ref, {
              authorName: finalDisplayName,
              authorAvatar: finalPhotoURL,
            });
          });
          await batch.commit();
        }
      } catch (error) {
        console.error("Error updating posts:", error);
      }

      Alert.alert("Success", "Profile updated successfully");
      onClose();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScreenHeader title="Edit Profile" rightAction="close" onRightPress={onClose} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.avatarSection}>
        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color={colors.text.muted} />
            </View>
          )}
          <View style={styles.editIconContainer}>
            <Ionicons name="camera" size={20} color={colors.accent.gold} />
          </View>
        </TouchableOpacity>
        {uploadingImage && (
          <Text style={styles.uploadingText}>Uploading image...</Text>
        )}
      </View>

      <Input
        placeholder="Display Name"
        value={displayName}
        onChangeText={setDisplayName}
        style={styles.input}
      />

      <Button
        title={loading ? "Saving..." : "Save Changes"}
        onPress={handleSave}
        variant="primary"
        loading={loading}
        disabled={loading || uploadingImage}
        style={styles.saveButton}
      />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  container: {
    flexGrow: 1,
    backgroundColor: colors.background.primary,
    padding: 20,
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
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.accent.gold,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: colors.accent.gold,
  },
  uploadingText: {
    color: colors.text.muted,
    fontSize: 12,
    marginTop: 8,
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 8,
  },
});

