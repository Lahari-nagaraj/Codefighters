// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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
    // Check if Firebase is properly initialized
    if (!auth || !db) {
      console.warn("⚠️ Firebase not initialized, skipping auth state listener");
      setLoading(false);
      return;
    }

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
      
      // Check if Firebase is properly initialized
      if (!auth || !googleProvider) {
        throw new Error("Firebase authentication not available. Please check your configuration.");
      }

      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      if (!db) {
        throw new Error("Firestore database not available. Please check your configuration.");
      }

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
  // Email/Password Sign Up
  // --------------------------------------------------
  const signUp = async (email, password, name, phone = "", role = DEFAULT_ROLE) => {
    try {
      setError(null);
      
      // Check if Firebase is properly initialized
      if (!auth) {
        throw new Error("Firebase authentication not available. Please check your configuration.");
      }

      const result = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = result.user;

      // Update display name
      await fbUser.updateProfile({
        displayName: name
      });

      if (!db) {
        throw new Error("Firestore database not available. Please check your configuration.");
      }

      const ref = doc(db, "users", fbUser.uid);
      const userData = {
        uid: fbUser.uid,
        email: fbUser.email ?? "",
        name: name,
        phone: phone,
        role,
        credits: DEFAULT_CREDITS,
        createdAt: serverTimestamp(),
        isActive: true,
      };

      await setDoc(ref, userData);

      // Sync with backend if available
      try {
        await ApiService?.registerUser?.(userData);
      } catch (err) {
        console.warn("Backend sync skipped:", err?.message);
      }

      setUser({
        ...userData,
        displayName: name,
        photoURL: fbUser.photoURL,
      });

      return { ok: true, role };
    } catch (e) {
      console.error("Email signup failed:", e);
      
      // Provide user-friendly error messages
      let errorMessage = "Sign up failed. Please try again.";
      
      if (e.code === 'auth/email-already-in-use') {
        errorMessage = "An account with this email already exists. Please sign in instead.";
      } else if (e.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please choose a stronger password.";
      } else if (e.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      } else if (e.message) {
        errorMessage = e.message;
      }
      
      setError(errorMessage);
      return { ok: false, error: errorMessage };
    }
  };

  // --------------------------------------------------
  // Email/Password Sign In
  // --------------------------------------------------
  const signInWithEmail = async (email, password, role = DEFAULT_ROLE) => {
    try {
      setError(null);
      
      // Check if Firebase is properly initialized
      if (!auth) {
        throw new Error("Firebase authentication not available. Please check your configuration.");
      }

      const result = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = result.user;

      if (!db) {
        throw new Error("Firestore database not available. Please check your configuration.");
      }

      const ref = doc(db, "users", fbUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
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
      } else {
        // User exists in Firebase but not in Firestore (edge case)
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
        setUser({
          ...userData,
          displayName: fbUser.displayName,
          photoURL: fbUser.photoURL,
        });
      }

      return { ok: true, role };
    } catch (e) {
      console.error("Email signin failed:", e);
      
      // Provide user-friendly error messages
      let errorMessage = "Sign in failed. Please try again.";
      
      if (e.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email. Please sign up instead.";
      } else if (e.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
      } else if (e.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      } else if (e.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (e.message) {
        errorMessage = e.message;
      }
      
      setError(errorMessage);
      return { ok: false, error: errorMessage };
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
        signUp,
        signInWithEmail,
        logout,
        signInWithPhone,
        setupRecaptcha,
        updateUserRole,
        updateUserProfile,
        clearError: () => setError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
