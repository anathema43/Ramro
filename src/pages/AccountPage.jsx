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

  useEffect(() => {
    if (loading) return;
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
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

  const handleLogout = async () => {
      await logout();
      navigate('/login');
  }

  if (loading || !currentUser) {
    return <div className="min-h-screen bg-stone-100 flex items-center justify-center">Loading...</div>;
  }

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
                <button onClick={handleLogout} className="w-full text-left flex items-center p-3 rounded-md transition-colors hover:bg-stone-100 mt-4 border-t pt-4">
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3"/> Logout
                </button>
              </nav>
            </div>
          </aside>
          
          <main className="md:w-3/4">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              {activeTab === 'profile' && (
                <div>
                  <h3 className="text-2xl font-bold text-stone-800 mb-6">Personal Information</h3>
                  {!isEditingName ? (
                    <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                      <div>
                        <p className="text-sm text-stone-500">Full Name</p>
                        <p className="text-lg text-stone-900">{currentUser.displayName || 'Not set'}</p>
                      </div>
                      <button onClick={() => setIsEditingName(true)} className="flex items-center text-amber-600 hover:text-amber-800 font-semibold">
                        <PencilIcon className="h-4 w-4 mr-1"/> Edit
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleProfileUpdate} className="flex items-end gap-4 p-4 bg-stone-50 rounded-lg">
                      <div className="flex-grow">
                        <label className="block text-sm text-stone-500">Edit Full Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border-b-2 border-stone-300 focus:border-amber-500 focus:outline-none bg-transparent"/>
                      </div>
                      <button type="submit" className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700">Save</button>
                    </form>
                  )}
                  <div className="mt-4 p-4 bg-stone-50 rounded-lg">
                    <p className="text-sm text-stone-500">Email Address (cannot be changed)</p>
                    <p className="text-lg text-stone-900">{currentUser.email}</p>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                 <div>
                    <h3 className="text-2xl font-bold text-stone-800 mb-6">Order History</h3>
                    <div className="text-center text-stone-500 bg-stone-50 p-6 rounded-lg">
                        <p>You have no past orders.</p>
                    </div>
                 </div>
              )}

              {activeTab === 'addresses' && (
                 <div>
                    <h3 className="text-2xl font-bold text-stone-800 mb-6">Manage Addresses</h3>
                    <div className="space-y-3 mb-6">
                        {addresses.map(addr => (
                            <div key={addr.id} className="bg-stone-50 p-4 rounded-lg flex justify-between items-center">
                                <p className="text-stone-700">{`${addr.street}, ${addr.city}, ${addr.state} - ${addr.zip}`}</p>
                                <button onClick={() => handleDeleteAddress(addr.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100">
                                    <TrashIcon className="h-5 w-5"/>
                                </button>
                            </div>
                        ))}
                         {addresses.length === 0 && <p className="text-stone-500">You have no saved addresses.</p>}
                    </div>
                    {!showAddressForm && (
                        <button onClick={() => setShowAddressForm(true)} className="flex items-center bg-stone-200 text-stone-700 px-4 py-2 rounded-md hover:bg-stone-300">
                            <PlusIcon className="h-5 w-5 mr-2"/> Add New Address
                        </button>
                    )}
                    {showAddressForm && (
                        <form onSubmit={handleAddAddress} className="mt-4 p-4 bg-stone-50 rounded-lg border space-y-3">
                            <h4 className="font-semibold text-stone-800">New Address Details</h4>
                            <input type="text" placeholder="Street Address" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="w-full p-2 rounded-md border" required />
                            <input type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} className="w-full p-2 rounded-md border" required />
                            <input type="text" placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} className="w-full p-2 rounded-md border" required />
                            <input type="text" placeholder="ZIP Code" value={newAddress.zip} onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})} className="w-full p-2 rounded-md border" required />
                            <div className="flex gap-4">
                                <button type="submit" className="flex-1 bg-amber-600 text-white py-2 rounded-md hover:bg-amber-700">Save Address</button>
                                <button type="button" onClick={() => setShowAddressForm(false)} className="flex-1 bg-stone-200 text-stone-700 py-2 rounded-md hover:bg-stone-300">Cancel</button>
                            </div>
                        </form>
                    )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;