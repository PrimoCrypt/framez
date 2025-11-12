import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing Firebase environment variable: ${key}`);
  }
  return value;
};

const firebaseConfig: FirebaseOptions = {
  apiKey: getEnv("EXPO_PUBLIC_FIREBASE_API_KEY"),
  authDomain: getEnv("EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: getEnv("EXPO_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: getEnv("EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnv("EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnv("EXPO_PUBLIC_FIREBASE_APP_ID"),
};

const hasAppInstance = getApps().length > 0;
const app = hasAppInstance ? getApp() : initializeApp(firebaseConfig);

const auth = hasAppInstance
  ? getAuth(app)
  : initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, serverTimestamp };
export default app;