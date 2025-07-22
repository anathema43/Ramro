import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';

const AccountPage = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || '');

  const handleSave = async () => {
    try {
      await user.updateProfile({ displayName: name });
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!user) {
    return <div className="text-center mt-10">You must be logged in to view this page.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Account</h1>
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            className="border px-4 py-2 w-full rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
        </div>
      ) : (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-stone-800">{user.displayName}</h2>
          <button onClick={() => setIsEditing(true)} className="bg-stone-800 text-white px-4 py-2 rounded">
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
