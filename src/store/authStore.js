import { create } from "zustand";
// FIX: Removed direct import of useCartStore to break circular dependency
// import { useCartStore } from './cartStore'; // REMOVED THIS LINE

// Firebase functions are passed from App.jsx where they are initialized
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
let firebaseCollection = null;
let firebaseGetDocs = null;
let firebaseDeleteDoc = null;


export const useAuthStore = create((set, get) => ({
  isLoggedIn: false,
  userToken: null,
  user: null, // Stores user data like { uid, email, name }
  authError: null,
  authLoading: false,

  // Action to set Firebase Auth and Firestore instances from App.jsx
  setFirebaseInstances: (auth, db, currentAppId, onAuthStateChangedFn, signInWithEmailAndPasswordFn, createUserWithEmailAndPasswordFn, signOutFn, docFn, setDocFn, getDocFn, collectionFn, getDocsFn, deleteDocFn) => {
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
    firebaseCollection = collectionFn;
    firebaseGetDocs = getDocsFn;
    firebaseDeleteDoc = deleteDocFn;
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
        userToken: await user.getIdToken(),
        user: userData,
        authError: null,
      });

      // Load cart after successful login
      // FIX: Access useCartStore via window object to avoid circular dependency
      window.useCartStore.getState().loadCartFromFirestore(user.uid);

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

      // Save empty cart to Firestore for new user
      // FIX: Access useCartStore via window object
      window.useCartStore.getState().saveCartToFirestore(user.uid, []);

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
    // When logging out, clear the local cart, but also save current cart to Firestore if user was logged in
    const currentCart = window.useCartStore.getState().cart; // Get current cart before clearing
    const currentUser = get().user; // Get user before it's cleared by set()
    // FIX: Access useCartStore via window object
    if (currentUser && currentCart.length > 0) { // Only save if user was logged in and cart not empty
        window.useCartStore.getState().saveCartToFirestore(currentUser.uid, currentCart);
    }
    window.useCartStore.getState().clearCart(); // Clear local cart after saving (or if not logged in)
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

        // Load cart from Firestore when user logs in/auth state changes to logged in
        // FIX: Access useCartStore via window object
        window.useCartStore.getState().loadCartFromFirestore(user.uid);

      } else {
        // User is signed out
        // Save current cart to Firestore before clearing if user was just logged out
        const currentUser = get().user; // Get user before it's cleared by set()
        const currentCart = window.useCartStore.getState().cart;
        // FIX: Access useCartStore via window object
        if (currentUser && currentCart.length > 0) { // Only save if user was logged in and cart not empty
            window.useCartStore.getState().saveCartToFirestore(currentUser.uid, currentCart);
        }
        set({ isLoggedIn: false, userToken: null, user: null });
        window.useCartStore.getState().clearCart(); // Clear local cart
      }
    });
  },

  // --- Address Management Actions ---
  // Path for addresses: artifacts/{appId}/users/{userId}/addresses/{addressId}
  addAddress: async (userId, addressData) => {
    if (!firebaseAuth || !firebaseDb || !appId || !userId) {
      console.error("Firebase/User not initialized for addAddress.");
      return { success: false, error: 'Firebase/User not initialized.' };
    }
    set({ authLoading: true });
    try {
      const addressesCollectionRef = firebaseCollection(firebaseDb, `artifacts/${appId}/users/${userId}/addresses`);
      const newAddressRef = await addDoc(addressesCollectionRef, { ...addressData, createdAt: new Date().toISOString() });
      console.log("Address added with ID:", newAddressRef.id);
      return { success: true, addressId: newAddressRef.id };
    } catch (error) {
      console.error("Error adding address:", error);
      return { success: false, error: error.message };
    } finally {
      set({ authLoading: false });
    }
  },

  getAddresses: async (userId) => {
    if (!firebaseAuth || !firebaseDb || !appId || !userId) {
      console.error("Firebase/User not initialized for getAddresses.");
      return { success: false, error: 'Firebase/User not initialized.' };
    }
    set({ authLoading: true });
    try {
      const addressesCollectionRef = firebaseCollection(firebaseDb, `artifacts/${appId}/users/${userId}/addresses`);
      const querySnapshot = await firebaseGetDocs(addressesCollectionRef);
      const addresses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Fetched addresses:", addresses);
      return { success: true, addresses: addresses };
    } catch (error) {
      console.error("Error getting addresses:", error);
      return { success: false, error: error.message };
    } finally {
      set({ authLoading: false });
    }
  },

  deleteAddress: async (userId, addressId) => {
    if (!firebaseAuth || !firebaseDb || !appId || !userId || !addressId) {
      console.error("Firebase/User/Address ID not initialized for deleteAddress.");
      return { success: false, error: 'Firebase/User/Address ID not initialized.' };
    }
    set({ authLoading: true });
    try {
      const addressDocRef = firebaseDoc(firebaseDb, `artifacts/${appId}/users/${userId}/addresses/${addressId}`);
      await firebaseDeleteDoc(addressDocRef);
      console.log("Address deleted:", addressId);
      return { success: true };
    } catch (error) {
      console.error("Error deleting address:", error);
      return { success: false, error: error.message };
    } finally {
      set({ authLoading: false });
    }
  }
}));