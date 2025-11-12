import React from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../theme/colors";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export default function Logo({ size = "md" }: LogoProps) {
  const sizeMap = {
    sm: { container: 20, border: 2, inner: 12 },
    md: { container: 32, border: 3, inner: 20 },
    lg: { container: 48, border: 4, inner: 30 },
  };

  const dimensions = sizeMap[size];

  return (
    <View style={[styles.container, { width: dimensions.container, height: dimensions.container }]}>
      <View style={[styles.outerFrame, { 
        width: dimensions.container, 
        height: dimensions.container,
        borderWidth: dimensions.border,
      }]}>
        {/* Inner frame */}
        <View style={[styles.innerFrame, { 
          width: dimensions.inner, 
          height: dimensions.inner,
          borderWidth: dimensions.border - 1,
        }]}>
          {/* F letter - vertical line */}
          <View style={[styles.fVertical, { 
            width: dimensions.border, 
            height: dimensions.inner * 0.7,
          }]} />
          {/* F letter - top horizontal */}
          <View style={[styles.fHorizontal, { 
            width: dimensions.inner * 0.5, 
            height: dimensions.border,
            top: dimensions.inner * 0.15,
          }]} />
          {/* F letter - middle horizontal */}
          <View style={[styles.fHorizontal, { 
            width: dimensions.inner * 0.4, 
            height: dimensions.border,
            top: dimensions.inner * 0.4,
          }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  outerFrame: {
    borderRadius: 6,
    borderColor: colors.accent.gold,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  innerFrame: {
    borderRadius: 4,
    borderColor: colors.accent.gold,
    position: "relative",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  fVertical: {
    backgroundColor: colors.accent.gold,
    position: "absolute",
    left: 2,
    top: 2,
    borderRadius: 1,
  },
  fHorizontal: {
    backgroundColor: colors.accent.gold,
    position: "absolute",
    left: 2,
    borderRadius: 1,
  },
});

