import { create } from "zustand";
// Firebase imports will be handled in App.jsx where they are initialized
// We declare them here so Zustand store can use them via setFirebaseInstances
let firebaseAuth = null;
let firebaseDb = null;
let appId = null;
let firebaseOnAuthStateChanged = null;
let firebaseSignInWithEmailAndPassword = null;
let firebaseCreateUserWithEmailAndPassword = null;
let firebaseSignOut = null;
let firebaseDoc = null;
let firebaseSetDoc = null;
let firebaseGetDoc = null;


export const useAuthStore = create((set, get) => ({
  isLoggedIn: false,
  userToken: null,
  user: null, // Stores user data like { uid, email, name }
  authError: null,
  authLoading: false,

  // Action to set Firebase Auth and Firestore instances from App.jsx
  setFirebaseInstances: (auth, db, currentAppId, onAuthStateChangedFn, signInWithEmailAndPasswordFn, createUserWithEmailAndPasswordFn, signOutFn, docFn, setDocFn, getDocFn) => {
    firebaseAuth = auth;
    firebaseDb = db;
    appId = currentAppId;
    firebaseOnAuthStateChanged = onAuthStateChangedFn;
    firebaseSignInWithEmailAndPassword = signInWithEmailAndPasswordFn;
    firebaseCreateUserWithEmailAndPassword = createUserWithEmailAndPasswordFn;
    firebaseSignOut = signOutFn;
    firebaseDoc = docFn;
    firebaseSetDoc = setDocFn;
    firebaseGetDoc = getDocFn;
  },

  // Login action using Firebase Auth
  login: async (email, password) => {
    if (!firebaseAuth || !firebaseDb || !appId) {
      set({ authError: 'Firebase not initialized.' });
      return { success: false, error: 'Firebase not initialized.' };
    }

    set({ authLoading: true, authError: null });
    try {
      const userCredential = await firebaseSignInWithEmailAndPassword(firebaseAuth, email, password);
      const user = userCredential.user;

      // Fetch user profile from Firestore
      const userDocRef = firebaseDoc(firebaseDb, `artifacts/${appId}/users/${user.uid}/profile/data`);
      const userDocSnap = await firebaseGetDoc(userDocRef);
      let userData = { uid: user.uid, email: user.email, name: user.email }; // Default to email if no profile

      if (userDocSnap.exists()) {
        userData = { ...userDocSnap.data(), uid: user.uid, email: user.email };
      }

      set({
        isLoggedIn: true,
        userToken: await user.getIdToken(), // Get actual Firebase ID token
        user: userData,
        authError: null,
      });
      return { success: true };
    } catch (error) {
      let errorMessage = 'Login failed.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with that email. Please sign up.';
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many login attempts. Please try again later.';
      } else {
        console.error("Firebase Login Error:", error);
        errorMessage = error.message;
      }
      set({ authError: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ authLoading: false });
    }
  },

  // Signup action using Firebase Auth
  signup: async (name, email, password) => {
    console.log("Attempting signup for:", email); // Debug log
    if (!firebaseAuth || !firebaseDb || !appId) {
      console.error("Firebase instances not available for signup."); // Debug log
      set({ authError: 'Firebase not initialized.' });
      return { success: false, error: 'Firebase not initialized.' };
    }

    set({ authLoading: true, authError: null });
    try {
      console.log("Calling createUserWithEmailAndPassword..."); // Debug log
      const userCredential = await firebaseCreateUserWithEmailAndPassword(firebaseAuth, email, password);
      const user = userCredential.user;
      console.log("User created in Firebase Auth:", user.uid); // Debug log

      // Store additional user profile data in Firestore
      const userProfile = {
        name: name,
        email: email, // Store email as well, though Firebase Auth has it
        createdAt: new Date().toISOString(),
      };
      // Path: /artifacts/{appId}/users/{userId}/profile/data
      const userDocRef = firebaseDoc(firebaseDb, `artifacts/${appId}/users/${user.uid}/profile/data`);
      console.log("Attempting to set Firestore document at path:", `artifacts/${appId}/users/${user.uid}/profile/data`); // Debug log
      await firebaseSetDoc(userDocRef, userProfile);
      console.log("Firestore document set successfully for user:", user.uid); // Debug log

      set({
        isLoggedIn: true,
        userToken: await user.getIdToken(),
        user: { ...userProfile, uid: user.uid },
        authError: null,
      });
      console.log("Signup successful!"); // Debug log
      return { success: true };
    } catch (error) {
      console.error("Firebase Signup Error caught:", error); // Debug log
      let errorMessage = 'Signup failed.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email address is already in use.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password (min 6 characters).'; // Added detail
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/Password sign-in is not enabled. Please enable it in Firebase Authentication settings.';
      }
      else {
        errorMessage = error.message;
      }
      set({ authError: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ authLoading: false });
      console.log("Signup process finished."); // Debug log
    }
  },

  // Logout action
  logout: async () => {
    if (firebaseAuth) {
      await firebaseSignOut(firebaseAuth);
    }
    set({ isLoggedIn: false, userToken: null, user: null, authError: null });
    useCartStore.getState().clearCart(); // Correctly access clearCart from useCartStore directly
  },

  // Listener for Firebase Auth state changes
  listenToAuthChanges: () => {
    if (!firebaseAuth || !firebaseDb || !appId || !firebaseOnAuthStateChanged) {
      console.warn('Firebase Auth/DB/Listener functions not ready for listener.');
      return;
    }

    firebaseOnAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        const userDocRef = firebaseDoc(firebaseDb, `artifacts/${appId}/users/${user.uid}/profile/data`);
        const userDocSnap = await firebaseGetDoc(userDocRef);
        let userData = { uid: user.uid, email: user.email, name: user.email };

        if (userDocSnap.exists()) {
          userData = { ...userDocSnap.data(), uid: user.uid, email: user.email };
        }
        set({ isLoggedIn: true, userToken: await user.getIdToken(), user: userData });
      } else {
        set({ isLoggedIn: false, userToken: null, user: null });
      }
    });
  }
}));