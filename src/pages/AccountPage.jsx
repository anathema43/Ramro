import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { updateUserProfile, addAddress, getAddresses, deleteAddress } from '../firebase/firestoreService';
import { UserCircleIcon, ClipboardDocumentListIcon, HomeIcon, ArrowRightOnRectangleIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const AccountPage = () => {
  const { currentUser, logout, loading } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  
  // State for components
  const [name, setName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '', zip: '' });

  // --- THIS useEffect FIXES THE REDIRECT ERROR ---
  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login');
    }
    if (currentUser) {
      setName(currentUser.displayName || '');
      const fetchAddresses = async () => {
        const querySnapshot = await getAddresses(currentUser.uid);
        setAddresses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      };
      fetchAddresses();
    }
  }, [currentUser, loading, navigate]);

  const handleProfileUpdate = async (e) => { e.preventDefault(); await updateUserProfile(currentUser.uid, { name }); setIsEditingName(false); };
  const handleAddAddress = async (e) => { e.preventDefault(); const docRef = await addAddress(currentUser.uid, newAddress); setAddresses([...addresses, { id: docRef.id, ...newAddress }]); setNewAddress({ street: '', city: '', state: '', zip: '' }); setShowAddressForm(false); };
  const handleDeleteAddress = async (addressId) => { await deleteAddress(currentUser.uid, addressId); setAddresses(addresses.filter(addr => addr.id !== addressId)); };

  if (loading || !currentUser) {
    return <div className="min-h-screen bg-stone-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-stone-100 pt-10">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
         {/* ... The rest of your AccountPage JSX from the previous step ... */}
      </div>
    </div>
  );
};

export default AccountPage;