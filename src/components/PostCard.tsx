import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { colors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { doc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

dayjs.extend(relativeTime);

interface PostCardProps {
  post: any;
  showLikeButton?: boolean;
  showDeleteMenu?: boolean;
  onDelete?: () => void;
}

export default function PostCard({ post, showLikeButton = false, showDeleteMenu = false, onDelete }: PostCardProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);

  useEffect(() => {
    if (user && post.likes) {
      setIsLiked(post.likes.includes(user.uid));
    }
  }, [user, post.likes]);

  const handleLike = async () => {
    if (!user || !post.id) return;
    
    try {
      const postRef = doc(db, "posts", post.id);
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(user.uid),
        });
        setIsLiked(false);
        setLikeCount((prev: number) => Math.max(0, prev - 1));
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(user.uid),
        });
        setIsLiked(true);
        setLikeCount((prev: number) => prev + 1);
      }
    } catch (error: any) {
      console.error("Error toggling like:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to like post. Please check your Firebase security rules."
      );
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "posts", post.id));
              onDelete?.();
            } catch (error) {
              Alert.alert("Error", "Failed to delete post");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={{ uri: post.authorAvatar || "https://placehold.co/40x40" }}
          style={styles.avatar}
        />
        <View style={styles.headerText}>
          <Text style={styles.author}>{post.authorName}</Text>
          <Text style={styles.time}>
            {post.createdAt?.toDate ? dayjs(post.createdAt.toDate()).fromNow() : ""}
          </Text>
        </View>
        {showDeleteMenu && (
          <TouchableOpacity onPress={handleDelete} style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={20} color={colors.text.primary} />
          </TouchableOpacity>
        )}
        {showLikeButton && (
          <View style={styles.likeContainer}>
            <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={24}
                color={isLiked ? colors.accent.gold : colors.text.muted}
              />
            </TouchableOpacity>
            {likeCount > 0 && (
              <Text style={styles.likeCount}>{likeCount}</Text>
            )}
          </View>
        )}
      </View>
      {post.text ? <Text style={styles.text}>{post.text}</Text> : null}
      {post.imageUrl ? (
        <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: colors.background.secondary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  headerText: {
    flex: 1,
  },
  author: {
    fontWeight: "600",
    fontSize: 16,
    color: colors.accent.gold,
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
    color: colors.text.muted,
  },
  text: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.primary,
  },
  postImage: {
    width: "100%",
    height: 250,
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: colors.background.tertiary,
  },
  menuButton: {
    padding: 4,
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  likeButton: {
    padding: 4,
  },
  likeCount: {
    color: colors.text.muted,
    fontSize: 12,
    fontWeight: "600",
  },
});
