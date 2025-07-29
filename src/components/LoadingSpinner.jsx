import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-organic-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-organic-primary mx-auto mb-4"></div>
        <p className="text-organic-text">Loading...</p>
      </div>
    </div>
  );
}