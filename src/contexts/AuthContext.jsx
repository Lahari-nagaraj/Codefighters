// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithPhoneNumber,
  signOut,
  RecaptchaVerifier,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db } from "../config/firebase";
import ApiService from "../services/api"; // optional backend sync

// ----------------------
// Context & Hook
// ----------------------
const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

// Default values
const DEFAULT_ROLE = "farmer";
const DEFAULT_CREDITS = 50;

// ----------------------
// Provider Component
// ----------------------
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // merged Firebase + Firestore user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --------------------------------------------------
  // Sync Firebase Auth with Firestore Profile
  // --------------------------------------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      try {
        if (!fbUser) {
          setUser(null);
          return;
        }

        const ref = doc(db, "users", fbUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
            ...data,
          });
        } else {
          // First-time login → create Firestore doc
          const newUser = {
            uid: fbUser.uid,
            email: fbUser.email ?? "",
            name: fbUser.displayName || "User",
            phone: fbUser.phoneNumber || "",
            role: DEFAULT_ROLE,
            credits: DEFAULT_CREDITS,
            createdAt: serverTimestamp(),
            isActive: true,
          };

          await setDoc(ref, newUser);

          // Sync with backend if available
          try {
            await ApiService?.registerUser?.(newUser);
          } catch (err) {
            console.warn("Backend sync skipped:", err?.message);
          }

          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
            ...newUser,
          });
        }
      } catch (e) {
        console.error("Auth state error:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    });

    return unsub; // cleanup listener
  }, []);

  // --------------------------------------------------
  // Google Login (role-aware)
  // --------------------------------------------------
  const login = async (role = DEFAULT_ROLE) => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      const ref = doc(db, "users", fbUser.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        const userData = {
          uid: fbUser.uid,
          email: fbUser.email ?? "",
          name: fbUser.displayName || "User",
          phone: fbUser.phoneNumber || "",
          role,
          credits: DEFAULT_CREDITS,
          createdAt: serverTimestamp(),
          isActive: true,
        };
        await setDoc(ref, userData);

        try {
          await ApiService?.registerUser?.(userData);
        } catch (err) {
          console.warn("Backend sync skipped:", err?.message);
        }

        setUser({
          ...userData,
          displayName: fbUser.displayName,
          photoURL: fbUser.photoURL,
        });
      } else {
        const existing = snap.data();

        // Update role if it changed
        if (existing.role !== role) {
          await setDoc(ref, { role }, { merge: true });
          try {
            await ApiService?.updateUserProfile?.(fbUser.uid, { role });
          } catch (err) {
            console.warn("Backend role update skipped:", err?.message);
          }
        }

        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
          photoURL: fbUser.photoURL,
          ...existing,
          role,
        });
      }

      return { ok: true, role };
    } catch (e) {
      console.error("Google login failed:", e);
      setError(e.message);
      return { ok: false, error: e.message };
    }
  };

  // --------------------------------------------------
  // Phone Authentication
  // --------------------------------------------------
  const signInWithPhone = async (phoneNumber, appVerifier) => {
    return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  };

  const setupRecaptcha = (elementId) =>
    new RecaptchaVerifier(auth, elementId, {
      size: "invisible",
      callback: () => console.log("reCAPTCHA solved ✅"),
    });

  // --------------------------------------------------
  // Profile Helpers
  // --------------------------------------------------
  const updateUserRole = async (role) => {
    if (!user) return;
    await setDoc(doc(db, "users", user.uid), { role }, { merge: true });
    try {
      await ApiService?.updateUserProfile?.(user.uid, { role });
    } catch (err) {
      console.warn("Backend role update skipped:", err?.message);
    }
    setUser((u) => ({ ...u, role }));
  };

  const updateUserProfile = async (profileData) => {
    if (!user) return;
    await setDoc(doc(db, "users", user.uid), profileData, { merge: true });
    try {
      await ApiService?.updateUserProfile?.(user.uid, profileData);
    } catch (err) {
      console.warn("Backend profile update skipped:", err?.message);
    }
    setUser((u) => ({ ...u, ...profileData }));
  };

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // --------------------------------------------------
  // Provider Export
  // --------------------------------------------------
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        signInWithPhone,
        setupRecaptcha,
        updateUserRole,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
