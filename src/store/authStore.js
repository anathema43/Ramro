import { create } from "zustand";
import { persist } from "zustand/middleware";
import { auth } from "../firebase/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const googleProvider = new GoogleAuthProvider();

export const useAuthStore = create(
  persist(
    (set, get) => ({
  currentUser: null,
  userProfile: null,
  loading: true,
  error: null,

  fetchUser: () => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // Fetch user profile from Firestore
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userProfile = userDoc.exists() ? userDoc.data() : null;
            set({ currentUser: user, userProfile, loading: false });
          } catch (error) {
            console.error("Error fetching user profile:", error);
            set({ currentUser: user, userProfile: null, loading: false });
          }
        } else {
          set({ currentUser: null, userProfile: null, loading: false });
        }
      });
      return unsubscribe;
    } catch (error) {
      console.log("Firebase not configured, using mock auth");
      set({ currentUser: null, userProfile: null, loading: false });
      return () => {};
    }
  },

  signup: async (email, password, name) => {
    set({ error: null, loading: true });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      // Create user profile in Firestore
      const userProfile = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: name,
        role: 'customer',
        createdAt: new Date().toISOString(),
        addresses: [],
        preferences: {
          currency: 'USD',
          language: 'en'
        }
      };
      
      await setDoc(doc(db, "users", userCredential.user.uid), userProfile);
      set({ currentUser: userCredential.user, userProfile, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ error: null, loading: true });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch user profile
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      const userProfile = userDoc.exists() ? userDoc.data() : null;
      
      set({ currentUser: userCredential.user, userProfile, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  loginWithGoogle: async () => {
    set({ error: null, loading: true });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user profile exists, create if not
      const userDoc = await getDoc(doc(db, "users", user.uid));
      let userProfile;
      
      if (!userDoc.exists()) {
        userProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: 'customer',
          createdAt: new Date().toISOString(),
          addresses: [],
          preferences: {
            currency: 'USD',
            language: 'en'
          }
        };
        await setDoc(doc(db, "users", user.uid), userProfile);
      } else {
        userProfile = userDoc.data();
      }
      
      set({ currentUser: user, userProfile, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await signOut(auth);
      set({ currentUser: null, userProfile: null, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateProfile: async (updates) => {
    const { currentUser } = get();
    if (!currentUser) throw new Error("No user logged in");
    
    set({ loading: true });
    try {
      await setDoc(doc(db, "users", currentUser.uid), updates, { merge: true });
      set({ userProfile: { ...get().userProfile, ...updates }, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}),
    {
      name: "auth-storage",
      partialize: (state) => ({ 
        currentUser: state.currentUser,
        userProfile: state.userProfile 
      }),
    }
  )
);