import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  isLoggedIn: false,
  user: null,
  currentUser: null, // Added for consistency
  loading: true, // Added loading state
  
  // Firebase instances - will be set by App.jsx
  _auth: null,
  _db: null,
  _appId: null,
  _onAuthStateChanged: null,
  _signOut: null,
  _createUserWithEmailAndPassword: null,
  _signInWithEmailAndPassword: null,
  _updateProfile: null,
  _doc: null,
  _setDoc: null,

  // This function is called once by App.jsx to give the store access to Firebase
  setFirebaseInstances: (instances) => {
    set({
      _auth: instances.auth,
      _db: instances.db,
      _appId: instances.appId,
      _onAuthStateChanged: instances.onAuthStateChanged,
      _signOut: instances.signOut,
      _createUserWithEmailAndPassword: instances.createUserWithEmailAndPassword,
      _signInWithEmailAndPassword: instances.signInWithEmailAndPassword,
      _updateProfile: instances.updateProfile,
      _doc: instances.doc,
      _setDoc: instances.setDoc,
    });
  },

  // This starts the listener that keeps the user state in sync with Firebase
  listenToAuthChanges: () => {
    const { _auth, _onAuthStateChanged } = get();
    if (_auth && _onAuthStateChanged) {
      _onAuthStateChanged(_auth, (user) => {
        if (user) {
          set({ 
            isLoggedIn: true, 
            user: user, 
            currentUser: user, 
            loading: false 
          });
          // Load cart from Firestore when user logs in
          if (window.useCartStore) {
            window.useCartStore.getState().loadCartFromFirestore(user.uid);
          }
        } else {
          set({ 
            isLoggedIn: false, 
            user: null, 
            currentUser: null, 
            loading: false 
          });
          // Clear cart when user logs out
          if (window.useCartStore) {
            window.useCartStore.getState().clearLocalCart();
          }
        }
      });
    }
  },

  // Signup function for the SignupPage
  signup: async (email, password, name) => {
    const { _auth, _createUserWithEmailAndPassword, _updateProfile, _db, _doc, _setDoc } = get();
    const userCredential = await _createUserWithEmailAndPassword(_auth, email, password);
    if (userCredential.user) {
      await _updateProfile(userCredential.user, { displayName: name });
      await _setDoc(_doc(_db, 'users', userCredential.user.uid), {
        name: name,
        email: email,
      });
    }
  },

  // Login function for the LoginPage
  login: async (email, password) => {
    const { _auth, _signInWithEmailAndPassword } = get();
    await _signInWithEmailAndPassword(_auth, email, password);
  },
  
  // Logout function for the AccountPage/Navbar
  logout: async () => {
    const { _signOut, _auth } = get();
    await _signOut(_auth);
  },
}));