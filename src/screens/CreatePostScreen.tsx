import React, { useState } from "react";
import { View, Image, Alert, StyleSheet, ScrollView, TouchableOpacity, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { storage, db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { serverTimestamp } from "firebase/firestore";
import { Button, Input } from "../components/ui";
import { colors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader from "../components/ScreenHeader";

export default function CreatePostScreen({ navigation }: any) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!res.canceled && res.assets && res.assets.length > 0) {
      setImage(res.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const submit = async () => {
    if (!user) return;
    if (!text.trim() && !image) {
      Alert.alert("Error", "Please add some text or an image");
      return;
    }
    setUploading(true);
    try {
      let imageUrl: string | null = null;
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const fileRef = ref(storage, `posts/${user.uid}/${Date.now()}`);
        await uploadBytes(fileRef, blob);
        imageUrl = await getDownloadURL(fileRef);
      }
      await addDoc(collection(db, "posts"), {
        authorId: user.uid,
        authorName: user.displayName || "Anonymous",
        authorAvatar: user.photoURL || null,
        text: text.trim(),
        imageUrl,
        likes: [],
        createdAt: serverTimestamp(),
      });
      setText("");
      setImage(null);
      navigation.navigate("Feed");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScreenHeader title="Create Post" rightAction="profile" />
      <ScrollView contentContainerStyle={styles.container}>
        <Input
          placeholder="What's on your mind?"
          value={text}
          onChangeText={setText}
          multiline
          style={styles.input}
          textStyle={styles.inputText}
        />
      
      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
            <Ionicons name="close-circle" size={24} color={colors.status.error} />
          </TouchableOpacity>
        </View>
      )}
      
      <Button
        title="Pick Image"
        onPress={pickImage}
        variant="secondary"
        style={styles.imageButton}
      />
      
      <Button
        title={uploading ? "Posting..." : "Post"}
        onPress={submit}
        disabled={uploading || (!text.trim() && !image)}
        loading={uploading}
        variant="primary"
        style={styles.submitButton}
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
    padding: 16,
  },
  input: {
    minHeight: 120,
    marginBottom: 16,
  },
  inputText: {
    textAlignVertical: "top",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.background.primary,
    borderRadius: 20,
    padding: 4,
  },
  imageButton: {
    marginBottom: 12,
  },
  submitButton: {
    marginTop: 8,
  },
});
