import { db, auth } from '../firebase';
import { doc, setDoc, getDoc, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

export const updateUserProfile = async (userId, profileData) => {
  if (profileData.name && auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: profileData.name });
  }
  const userDocRef = doc(db, 'users', userId);
  return setDoc(userDocRef, profileData, { merge: true });
};

export const getUserProfile = (userId) => {
  const userDocRef = doc(db, 'users', userId);
  return getDoc(userDocRef);
};

export const addAddress = (userId, addressData) => {
  const addressesCollectionRef = collection(db, 'users', userId, 'addresses');
  return addDoc(addressesCollectionRef, addressData);
};

export const getAddresses = (userId) => {
  const addressesCollectionRef = collection(db, 'users', userId, 'addresses');
  return getDocs(addressesCollectionRef);
};

export const deleteAddress = (userId, addressId) => {
  const addressDocRef = doc(db, 'users', userId, 'addresses', addressId);
  return deleteDoc(addressDocRef);
};

// --- THIS IS THE CORRECTED FUNCTION ---
export const saveCartToFirestore = (userId, cartItems) => {
  const userDocRef = doc(db, 'users', userId);
  // Using setDoc with merge:true will create the document if it doesn't exist,
  // or update the cart field if it does. This prevents the "No document to update" error.
  return setDoc(userDocRef, { cart: cartItems }, { merge: true });
};

export const getCartFromFirestore = async (userId) => {
  const userDocRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userDocRef);
  if (docSnap.exists() && docSnap.data().cart) {
    return docSnap.data().cart;
  } else {
    return [];
  }
};