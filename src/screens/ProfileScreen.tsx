import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { useAuth } from "../context/AuthContext";
import { query, collection, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import PostCard from "../components/PostCard";
import { Button } from "../components/ui";
import { colors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import EditProfileScreen from "./EditProfileScreen";
import ScreenHeader from "../components/ScreenHeader";

export default function ProfileScreen({ navigation }: any) {
  const { user, signOut } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "posts"), where("authorId", "==", user.uid), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const arr: any[] = [];
      snap.forEach((doc) => arr.push({ id: doc.id, ...doc.data() }));
      setPosts(arr);
    });
    return () => unsub();
  }, [user]);

  const handleDeletePost = () => {
  };

  if (showEditProfile) {
    return <EditProfileScreen onClose={() => setShowEditProfile(false)} />;
  }

  return (
    <View style={styles.container}>
      <ScreenHeader 
        title="Profile" 
        rightAction="settings" 
        onRightPress={() => setShowEditProfile(true)} 
      />
      
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={60} color={colors.text.muted} />
            </View>
          )}
        </View>
        
        <Text style={styles.name}>{user?.displayName || "User"}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        
        <Button 
          title="Log out" 
          onPress={signOut} 
          variant="secondary" 
          style={styles.logoutButton} 
        />
      </View>
      
      <FlatList
        data={posts}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <PostCard post={item} showDeleteMenu onDelete={handleDeletePost} />
        )}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
    backgroundColor: colors.background.secondary,
  },
  avatarContainer: {
    marginBottom: 16,
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
    backgroundColor: colors.background.tertiary,
    borderWidth: 3,
    borderColor: colors.accent.gold,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  email: {
    color: colors.text.muted,
    fontSize: 14,
    marginBottom: 20,
  },
  logoutButton: {
    minWidth: 120,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    color: colors.text.muted,
    fontSize: 16,
  },
});
