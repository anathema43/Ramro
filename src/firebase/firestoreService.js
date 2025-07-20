import { db, auth } from '../firebase';
import { doc, setDoc, getDoc, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

/**
 * Updates the user's profile data in both Firebase Auth and Firestore.
 * @param {string} userId The user's unique ID.
 * @param {object} profileData The data to update (e.g., { name: 'New Name' }).
 */
export const updateUserProfile = async (userId, profileData) => {
  // Update the name in Firebase Authentication
  if (profileData.name && auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: profileData.name });
  }
  
  // Update/create the user document in Firestore
  const userDocRef = doc(db, 'users', userId);
  // 'merge: true' prevents overwriting other fields if the document exists
  return setDoc(userDocRef, profileData, { merge: true });
};

/**
 * Gets the user's profile data from Firestore.
 * @param {string} userId The user's unique ID.
 */
export const getUserProfile = (userId) => {
    const userDocRef = doc(db, 'users', userId);
    return getDoc(userDocRef);
}

/**
 * Adds a new address to a user's 'addresses' subcollection.
 * @param {string} userId The user's unique ID.
 * @param {object} addressData The new address information.
 */
export const addAddress = (userId, addressData) => {
  const addressesCollectionRef = collection(db, 'users', userId, 'addresses');
  return addDoc(addressesCollectionRef, addressData);
};

/**
 * Fetches all addresses for a given user.
 * @param {string} userId The user's unique ID.
 */
export const getAddresses = (userId) => {
  const addressesCollectionRef = collection(db, 'users', userId, 'addresses');
  return getDocs(addressesCollectionRef);
};

/**
 * Deletes an address from a user's subcollection.
 * @param {string} userId The user's unique ID.
 * @param {string} addressId The ID of the address document to delete.
 */
export const deleteAddress = (userId, addressId) => {
  const addressDocRef = doc(db, 'users', userId, 'addresses', addressId);
  return deleteDoc(addressDocRef);
};