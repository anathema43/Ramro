import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import HeroSection from '../components/HeroSection';
import { UserCircleIcon, ArrowRightOnRectangleIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const AccountPage = () => {
  const { currentUser, logout, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="min-h-screen bg-stone-100 flex items-center justify-center">Loading...</div>;
  }

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <HeroSection
        title="My Account"
        imageSrc="https://res.cloudinary.com/dj4kdlwzo/image/upload/v1752940186/darjeeling_qicpwi.avif"
        heightClass="h-72"
      />
      <div className="container mx-auto p-6 sm:p-8 lg:p-10 -mt-20">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-6 md:p-8">
          <div className="flex items-center border-b pb-6 mb-6">
            <UserCircleIcon className="h-16 w-16 text-amber-600 mr-4"/>
            <div>
              <h2 className="text-2xl font-bold text-stone-800">
                {currentUser.displayName || 'Welcome!'}
              </h2>
              <p className="text-stone-600">{currentUser.email}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center">
              <ClipboardDocumentListIcon className="h-6 w-6 mr-2 text-amber-600"/>
              Order History
            </h3>
            <div className="text-center text-stone-500 bg-stone-50 p-6 rounded-lg">
              <p>You have no past orders.</p>
              <p className="text-sm mt-1">When you place an order, it will appear here.</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full sm:w-auto bg-amber-600 text-white px-6 py-3 rounded-md hover:bg-amber-700 flex items-center justify-center active:scale-95"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2"/>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;