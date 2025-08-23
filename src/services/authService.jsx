import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // You can call your backend API to register the user in Firestore
    await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        phone: user.phoneNumber,
        role: "farmer", // default role, or detect based on your logic
      }),
    });

    return user;
  } catch (error) {
    console.error("Google login failed", error);
    throw error;
  }
};
