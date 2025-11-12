import React, { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut, User } from "firebase/auth";
import { auth } from "../lib/firebase";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, signOut: async () => {} });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return <AuthContext.Provider value={{ user, loading, signOut }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);