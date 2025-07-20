import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import { useAuthStore } from "../store/authStore";
import { UserIcon, MapPinIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';


const AccountPage = ({ showMessage }) => {
  const { user, isLoggedIn, getAddresses, addAddress, deleteAddress, authLoading } = useAuthStore();
  const [addresses, setAddresses] = useState([]);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({ street: '', city: '', state: '', zip: '', country: '' });
  const [formError, setFormError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const fetchAddresses = async () => {
    if (user?.uid) {
      const result = await getAddresses(user.uid);
      if (result.success) {
        setAddresses(result.addresses);
      } else {
        showMessage(`Error fetching addresses: ${result.error}`, 'error');
      }
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user, isLoggedIn]);

  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!addressForm.street || !addressForm.city || !addressForm.state || !addressForm.zip || !addressForm.country) {
      setFormError('All address fields are required.');
      return;
    }

    if (user?.uid) {
      const result = await addAddress(user.uid, addressForm);
      if (result.success) {
        showMessage('Address added successfully!', 'success');
        setAddressForm({ street: '', city: '', state: '', zip: '', country: '' });
        setShowAddAddressForm(false);
        fetchAddresses();
      } else {
        showMessage(`Error adding address: ${result.error}`, 'error');
      }
    } else {
      showMessage('You must be logged in to add an address.', 'error');
    }
  };

  const confirmDelete = (address) => {
    setAddressToDelete(address);
    setShowDeleteConfirm(true);
  };

  const handleDeleteAddress = async () => {
    if (user?.uid && addressToDelete) {
      const result = await deleteAddress(user.uid, addressToDelete.id);
      if (result.success) {
        showMessage('Address deleted successfully!', 'success');
        fetchAddresses();
      } else {
        showMessage(`Error deleting address: ${result.error}`, 'error');
      }
    }
    setShowDeleteConfirm(false);
    setAddressToDelete(null);
  };

  const HERO_BACKGROUND_IMAGE = "https://res.cloudinary.com/dj4kdlwzo/image/upload/v1752940186/darjeeling_qicpwi.avif";

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-stone-100 text-stone-900 flex items-center justify-center p-8">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg my-8 text-stone-900 text-center">
          <h1 className="text-3xl font-bold mb-4 text-stone-800">Access Denied</h1>
          <p className="text-stone-700 mb-6">Please log in to view your account details.</p>
          <Link to="/login" className="bg-amber-600 text-white px-6 py-3 rounded-md hover:bg-amber-700 transition-colors duration-200 active:scale-95">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <HeroSection
        title="My Account"
        imageSrc={HERO_BACKGROUND_IMAGE}
        heightClass="h-72"
      />
      <div className="container mx-auto p-6 sm:p-8 lg:p-10 bg-white rounded-lg shadow-lg my-8 text-stone-900">
        <h1 className="text-3xl font-bold mb-6 text-center text-stone-800">Account Overview</h1>

        {authLoading && (
          <div className="flex justify-center items-center py-4">
            <svg className="animate-spin h-8 w-8 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-3 text-stone-700">Loading...</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User Profile Info */}
          <div className="bg-stone-50 p-6 rounded-lg shadow-md border border-stone-200">
            <h2 className="text-xl font-semibold mb-4 text-stone-800 flex items-center">
              <UserIcon className="w-6 h-6 mr-2 text-amber-600" /> Personal Information
            </h2>
            <p className="text-stone-700 mb-2"><strong>Name:</strong> {user?.name || 'N/A'}</p>
            <p className="text-stone-700 mb-2"><strong>Email:</strong> {user?.email || 'N/A'}</p>
            {/* Add more profile info here */}
          </div>

          {/* Address Management */}
          <div className="bg-stone-50 p-6 rounded-lg shadow-md border border-stone-200">
            <h2 className="text-xl font-semibold mb-4 text-stone-800 flex items-center justify-between">
              <span className="flex items-center"><MapPinIcon className="w-6 h-6 mr-2 text-amber-600" /> Your Addresses</span>
              <button
                onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                className="text-amber-600 hover:text-amber-700 flex items-center text-sm font-semibold active:scale-95"
              >
                <PlusCircleIcon className="w-5 h-5 mr-1" /> {showAddAddressForm ? 'Cancel' : 'Add New'}
              </button>
            </h2>

            {showAddAddressForm && (
              <form onSubmit={handleAddAddressSubmit} className="space-y-3 mb-6 p-4 border border-stone-300 rounded-lg bg-white">
                <h3 className="text-lg font-semibold text-stone-800 mb-2">Add New Address</h3>
                <div><input type="text" placeholder="Street Address" className="w-full p-2 border border-stone-300 rounded-md focus:ring focus:ring-amber-500 bg-stone-50 text-stone-800" value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} required /></div>
                <div><input type="text" placeholder="City" className="w-full p-2 border border-stone-300 rounded-md focus:ring focus:ring-amber-500 bg-stone-50 text-stone-800" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} required /></div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="State/Province" className="w-full p-2 border border-stone-300 rounded-md focus:ring focus:ring-amber-500 bg-stone-50 text-stone-800" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} required />
                  <input type="text" placeholder="Zip/Postal Code" className="w-full p-2 border border-stone-300 rounded-md focus:ring focus:ring-amber-500 bg-stone-50 text-stone-800" value={addressForm.zip} onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })} required />
                </div>
                <div><input type="text" placeholder="Country" className="w-full p-2 border border-stone-300 rounded-md focus:ring focus:ring-amber-500 bg-stone-50 text-stone-800" value={addressForm.country} onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })} required /></div>
                {formError && <p className="text-red-500 text-sm text-center">{formError}</p>}
                <button type="submit" className="w-full bg-amber-600 text-white py-2 rounded-md hover:bg-amber-700 transition-colors active:scale-95 flex items-center justify-center">
                  {authLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>Save Address</>
                  )}
                </button>
              </form>
            )}

            {addresses.length === 0 ? (
              <p className="text-stone-600 mt-4">No addresses saved yet.</p>
            ) : (
              <ul className="space-y-4 mt-4">
                {addresses.map((address) => (
                  <li key={address.id} className="p-4 border border-stone-300 rounded-lg bg-white flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-stone-800">{address.street}</p>
                      <p className="text-stone-700">{address.city}, {address.state} {address.zip}</p>
                      <p className="text-stone-700">{address.country}</p>
                    </div>
                    <button
                      onClick={() => confirmDelete(address)}
                      className="text-red-500 hover:text-red-700 active:scale-95 transition-colors"
                      title="Delete Address"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="text-xl font-bold mb-4 text-stone-800">Confirm Deletion</h2>
            <p className="mb-6 text-stone-700">Are you sure you want to delete this address?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-stone-200 text-stone-700 px-4 py-2 rounded-md hover:bg-stone-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAddress}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// --- Main App Component ---
export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appMessage, setAppMessage] = useState({ message: '', type: '' });
  const setFirebaseInstances = useAuthStore((state) => state.setFirebaseInstances);
  const listenToAuthChanges = useAuthStore((state) => state.listenToAuthChanges);
  
  // AuthRedirector component (must be a child of Router)
  const AuthRedirector = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuthStore();

    useEffect(() => {
      // Redirect if logged in and trying to access auth pages
      if (isLoggedIn && (window.location.hash === '#/login' || window.location.hash === '#/signup')) {
        navigate('/'); // Redirect to home page
      }
    }, [isLoggedIn, navigate]);
    return null; // This component doesn't render anything
  };


  const showMessage = (message, type) => {
    setAppMessage({ message, type });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Firebase Initialization and Auth State Listener
  useEffect(() => {
    let firebaseApp;
    let authInstance;
    let dbInstance;
    let currentAppId;

    try {
      // Use the global variables provided by the Canvas environment
      currentAppId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
      const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

      if (!firebaseConfig) {
        console.error("Firebase config not found. Please provide __firebase_config.");
        showMessage("Firebase config missing. Auth will not work.", "error");
        return;
      }

      // Dynamically import Firebase modules
      Promise.all([
        import("https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js"),
        import("https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js")
      ]).then(([firebaseAppModule, firebaseAuthModule, firebaseFirestoreModule]) => {
        const { initializeApp } = firebaseAppModule;
        const { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } = firebaseAuthModule;
        const { getFirestore, doc, setDoc, getDoc, collection, getDocs, deleteDoc } = firebaseFirestoreModule; // Import collection, getDocs, deleteDoc

        firebaseApp = initializeApp(firebaseConfig);
        authInstance = getAuth(firebaseApp);
        dbInstance = getFirestore(firebaseApp);

        // Set Firebase instances and functions in Zustand store
        setFirebaseInstances(
          authInstance, 
          dbInstance, 
          currentAppId, 
          onAuthStateChanged, 
          signInWithEmailAndPassword, 
          createUserWithEmailAndPassword, 
          signOut, 
          doc, 
          setDoc, 
          getDoc,
          collection, 
          getDocs,    
          deleteDoc   
        );

        // Handle initial auth token if provided
        const signInWithToken = async () => {
          if (initialAuthToken) {
            try {
              await signInWithCustomToken(authInstance, initialAuthToken);
              console.log("Signed in with custom token.");
            } catch (error) {
              console.error("Error signing in with custom token:", error);
              showMessage("Failed to sign in automatically.", "error");
              // Fallback to anonymous if custom token fails
              await signInAnonymously(authInstance);
            }
          } else {
            // Sign in anonymously if no custom token
            signInAnonymously(authInstance)
              .then(() => console.log("Signed in anonymously."))
              .catch(error => console.error("Anonymous sign-in failed:", error));
          }
        };
        signInWithToken();

        // Listen to auth state changes and update Zustand store
        listenToAuthChanges();

      }).catch(error => {
        console.error("Failed to load Firebase modules:", error);
        showMessage("Failed to load Firebase. Auth will not work.", "error");
      });

    } catch (error) {
      console.error("Firebase initialization error:", error);
      showMessage("Firebase setup failed. Auth will not work.", "error");
    }

    // Cleanup function for auth listener (if needed, though onAuthStateChanged handles it)
    // return () => { if (authInstance) authInstance.onAuthStateChanged(() => {}); };
  }, []); // Empty dependency array means this runs once on mount

  // Ensure body background matches app background (for local consistency)
  useEffect(() => {
    document.body.style.backgroundColor = '#292524'; // stone-900 equivalent
    document.body.style.fontFamily = 'Inter, sans-serif';
    document.body.style.margin = '0';
    document.body.style.webkitFontSmoothing = 'antialiased';
    document.body.style.mozOsxFontSmoothing = 'grayscale';
    document.body.style.scrollBehavior = 'smooth';
  }, []);


  return (
    <Router>
      {/* AuthRedirector must be rendered INSIDE the Router context */}
      <AuthRedirector /> 
      <GlobalCssAnimations /> {/* Include global CSS animations */}
      <div className="min-h-screen flex flex-col bg-stone-900">
        {/* Navbar always visible */}
        <Navbar onMenuClick={toggleSidebar} />
        {/* Sidebar for mobile navigation */}
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
        {/* Global message/toast component */}
        <AppMessage message={appMessage.message} type={appMessage.type} onClose={() => setAppMessage({ message: '', type: '' })} />
        
        <main className="flex-grow"> {/* main content area */}
          {/* Define routes for different pages */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/products" element={<Home showMessage={showMessage} />} />
            <Route path="/products/:id" element={<ProductDetail showMessage={showMessage} />} />
            <Route path="/cart" element={<Cart showMessage={showMessage} />} />
            <Route path="/login" element={<Login showMessage={showMessage} />} />
            <Route path="/signup" element={<Signup showMessage={showMessage} />} />
            <Route path="/account" element={<AccountPage showMessage={showMessage} />} /> {/* New Account Page Route */}
            {/* Placeholder pages for About and Contact */}
            <Route path="/about" element={<div className="min-h-screen bg-stone-900 text-white p-8 flex items-center justify-center"><h1 className="text-4xl text-center">About Us Page - Coming Soon!</h1></div>} />
            <Route path="/contact" element={<div className="min-h-screen bg-stone-900 text-white p-8 flex items-center justify-center"><h1 className="text-4xl text-center">Contact Us Page - Coming Soon!</h1></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}