import { create } from "zustand";
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  query,
  where,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export const useProductStore = create((set, get) => ({
  products: [],
  featuredProducts: [],
  categories: [],
  searchResults: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Extract unique categories
      const categories = [...new Set(products.map(p => p.category))];
      
      set({ products, categories, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchFeaturedProducts: async () => {
    set({ loading: true, error: null });
    try {
      const q = query(
        collection(db, "products"),
        where("featured", "==", true),
        limit(4)
      );
      const querySnapshot = await getDocs(q);
      const featuredProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      set({ featuredProducts, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  getProductById: async (id) => {
    try {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      set({ error: error.message });
      return null;
    }
  },

  searchProducts: (searchTerm, category = 'all', sortBy = 'name') => {
    const { products } = get();
    
    let filtered = products.filter(product => {
      const matchesSearch = !searchTerm || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = category === 'all' || product.category === category;
      
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    set({ searchResults: filtered });
    return filtered;
  },
  addProduct: async (newProduct) => {
    set({ error: null });
    try {
      const productData = {
        ...newProduct,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        featured: false,
        rating: 0,
        reviewCount: 0
      };
      
      const docRef = await addDoc(collection(db, "products"), productData);
      set({ products: [...get().products, { ...newProduct, id: docRef.id }] });
    } catch (error) {
      set({ error: error.message });
    }
  },

  updateProduct: async (id, updatedFields) => {
    set({ error: null });
    try {
      const ref = doc(db, "products", id);
      const updateData = {
        ...updatedFields,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(ref, updateData);
      set({
        products: get().products.map(p => p.id === id ? { ...p, ...updateData } : p),
      });
    } catch (error) {
      set({ error: error.message });
    }
  },

  deleteProduct: async (id) => {
    set({ error: null });
    try {
      await deleteDoc(doc(db, "products", id));
      set({
        products: get().products.filter(p => p.id !== id),
      });
    } catch (error) {
      set({ error: error.message });
    }
  },

  clearError: () => set({ error: null }),
}));
