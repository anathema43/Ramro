import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const getCartFromFirestore = async (userId) => {
  const cartRef = doc(db, 'users', userId, 'cart', 'items');
  const docSnap = await getDoc(cartRef);
  return docSnap.exists() ? docSnap.data().items : [];
};

export const saveCartToFirestore = async (userId, cartItems) => {
  const cartRef = doc(db, 'users', userId, 'cart', 'items');
  await setDoc(cartRef, { items: cartItems });
};
