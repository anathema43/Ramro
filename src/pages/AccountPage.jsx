import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { updateUserProfile, addAddress, getAddresses, deleteAddress } from '../firebase/firestoreService';
import { UserCircleIcon, ClipboardDocumentListIcon, HomeIcon, ArrowRightOnRectangleIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const AccountPage = () => {
  const { currentUser, logout, loading } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  
  const [name, setName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '', zip: '' });

  // This useEffect hook is the correct way to handle redirects and data fetching.
  useEffect(() => {
    // First, check if authentication is still loading.
    if (loading) {
      return; // Do nothing until the loading is complete.
    }
    // If loading is finished and there is no user, then navigate to login.
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // If there is a user, fetch their data.
    setName(currentUser.displayName || '');
    const fetchAddresses = async () => {
      try {
        const querySnapshot = await getAddresses(currentUser.uid);
        setAddresses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    fetchAddresses();

  }, [currentUser, loading, navigate]);

  const handleProfileUpdate = async (e) => { e.preventDefault(); await updateUserProfile(currentUser.uid, { name }); setIsEditingName(false); };
  const handleAddAddress = async (e) => { e.preventDefault(); const docRef = await addAddress(currentUser.uid, newAddress); setAddresses([...addresses, { id: docRef.id, ...newAddress }]); setNewAddress({ street: '', city: '', state: '', zip: '' }); setShowAddressForm(false); };
  const handleDeleteAddress = async (addressId) => { await deleteAddress(currentUser.uid, addressId); setAddresses(addresses.filter(addr => addr.id !== addressId)); };

  // Show a loading state while checking for a user or if the redirect is about to happen.
  if (loading || !currentUser) {
    return <div className="min-h-screen bg-stone-100 flex items-center justify-center">Loading...</div>;
  }

  // Render the full page if the user is logged in.
  return (
    <div className="min-h-screen bg-stone-100 pt-10">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center border-b pb-4 mb-4">
                <UserCircleIcon className="h-12 w-12 text-stone-500 mr-3"/>
                <div>
                  <h2 className="font-bold text-stone-800 truncate">{currentUser.displayName || 'New User'}</h2>
                  <p className="text-sm text-stone-600 truncate">{currentUser.email}</p>
                </div>
              </div>
              <nav className="flex flex-col space-y-2">
                <button onClick={() => setActiveTab('profile')} className={`w-full text-left flex items-center p-3 rounded-md transition-colors ${activeTab === 'profile' ? 'bg-amber-100 text-amber-800 font-semibold' : 'hover:bg-stone-100'}`}>
                  <UserCircleIcon className="h-5 w-5 mr-3"/> Profile
                </button>
                <button onClick={() => setActiveTab('orders')} className={`w-full text-left flex items-center p-3 rounded-md transition-colors ${activeTab === 'orders' ? 'bg-amber-100 text-amber-800 font-semibold' : 'hover:bg-stone-100'}`}>
                  <ClipboardDocumentListIcon className="h-5 w-5 mr-3"/> My Orders
                </button>
                <button onClick={() => setActiveTab('addresses')} className={`w-full text-left flex items-center p-3 rounded-md transition-colors ${activeTab === 'addresses' ? 'bg-amber-100 text-amber-800 font-semibold' : 'hover:bg-stone-100'}`}>
                  <HomeIcon className="h-5 w-5 mr-3"/> Manage Addresses
                </button>
                <button onClick={async () => { await logout(); navigate('/login'); }} className="w-full text-left flex items-center p-3 rounded-md transition-colors hover:bg-stone-100 mt-4 border-t pt-4">
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3"/> Logout
                </button>
              </nav>
            </div>
          </aside>
          
          <main className="md:w-3/4">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              {/* Profile Content, Order History, and Address Management JSX here */}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;