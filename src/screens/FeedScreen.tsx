import React, { useEffect, useState } from "react";
import { FlatList, ActivityIndicator, StyleSheet, View } from "react-native";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import PostCard from "../components/PostCard";
import ScreenHeader from "../components/ScreenHeader";
import { colors } from "../theme/colors";

export default function FeedScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const arr: any[] = [];
      snap.forEach((doc) => {
        arr.push({ id: doc.id, ...doc.data() });
      });
      setPosts(arr);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent.gold} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader showLogo rightAction="profile" />
      <FlatList
        data={posts}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <PostCard post={item} showLikeButton />}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});
