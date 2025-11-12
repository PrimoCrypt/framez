import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import FeedScreen from "../../screens/FeedScreen";
import CreatePostScreen from "../../screens/CreatePostScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import { colors } from "../../theme/colors";

const Tab = createBottomTabNavigator();

export default function MainTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.background.secondary,
          borderTopColor: colors.border.default,
          borderTopWidth: 1,
          elevation: 10,
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "Feed") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Create") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          const iconSize = route.name === "Create" ? (focused ? 32 : 28) : (focused ? 30 : 26);

          return (
            <Ionicons
              name={iconName}
              size={iconSize}
              color={focused ? colors.accent.gold : colors.text.muted}
            />
          );
        },
        tabBarActiveTintColor: colors.accent.gold,
        tabBarInactiveTintColor: colors.text.muted,
      })}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Create" component={CreatePostScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
