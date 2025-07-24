import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const AccountPage = () => {
  const { user, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || '');
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      await user.updateProfile({ displayName: name });
      setIsEditing(false);
      // Force a re-render by updating the auth store
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!user) {
    return <div className="text-center mt-10">You must be logged in to view this page.</div>;
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-6 text-stone-800">My Account</h1>
          
          {/* Profile Section */}
          <div className="mb-8 p-4 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-stone-800">Profile Information</h3>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-md bg-stone-100 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleSave} 
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)} 
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-stone-600">Name</p>
                  <h2 className="text-lg font-semibold text-stone-800">{user.displayName || 'No name set'}</h2>
                </div>
                <div>
                  <p className="text-stone-600">Email</p>
                  <p className="text-lg text-stone-800">{user.email}</p>
                </div>
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* Logout Section */}
          <div className="pt-6 border-t">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;