import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Logo from "./Logo";
import { colors } from "../theme/colors";
import { useAuth } from "../context/AuthContext";

interface ScreenHeaderProps {
  title?: string;
  showLogo?: boolean;
  rightAction?: "profile" | "close" | "settings" | React.ReactNode;
  onRightPress?: () => void;
}

export default function ScreenHeader({
  title,
  showLogo = false,
  rightAction = "profile",
  onRightPress,
}: ScreenHeaderProps) {
  const navigation = useNavigation();
  const { user } = useAuth();

  const handleProfilePress = () => {
    if (onRightPress) {
      onRightPress();
    } else {
      // @ts-ignore
      navigation.navigate("Profile");
    }
  };

  const renderRightAction = () => {
    if (typeof rightAction === "string") {
      if (rightAction === "profile") {
        return (
          <TouchableOpacity onPress={handleProfilePress} style={styles.profileButton}>
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatar} />
            ) : (
              <Ionicons name="person-circle-outline" size={32} color={colors.accent.gold} />
            )}
          </TouchableOpacity>
        );
      } else if (rightAction === "close") {
        return (
          <TouchableOpacity onPress={onRightPress} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        );
      } else if (rightAction === "settings") {
        return (
          <TouchableOpacity onPress={onRightPress} style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={colors.accent.gold} />
          </TouchableOpacity>
        );
      }
    }
    return rightAction;
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          {showLogo ? (
            <>
              <Logo size="sm" />
              <Text style={styles.brandName}>Framez</Text>
            </>
          ) : title ? (
            <Text style={styles.title}>{title}</Text>
          ) : null}
        </View>
        {renderRightAction()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  brandName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.accent.gold,
    letterSpacing: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
  },
  profileButton: {
    padding: 4,
  },
  closeButton: {
    padding: 4,
  },
  settingsButton: {
    padding: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.accent.gold,
  },
});

