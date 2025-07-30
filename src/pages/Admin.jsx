import React, { useEffect, useState } from "react";
import AdminSeedButton from "../components/AdminSeedButton";
import ArtisanSeedButton from "../components/ArtisanSeedButton";
import AdminAlgoliaSync from "../components/AdminAlgoliaSync";
import ImageUpload from "../components/ImageUpload";
import BulkProductUpload from "../components/BulkProductUpload";
import { useProductStore } from "../store/productStore";
import { useOrderStore } from "../store/orderStore";
import { useInventoryStore } from "../store/inventoryStore";
import formatCurrency from "../utils/formatCurrency";
import LoadingSpinner from "../components/LoadingSpinner";
import { TrashIcon, PencilIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { cloudinaryService } from "../services/cloudinaryService";

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  image: "",
  quantityAvailable: "",
  category: "",
  cloudinaryPublicId: "",
  optimizedImageUrl: ""
};

export default function Admin() {
  const {
    products,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    loading: productsLoading,
  } = useProductStore();

  const {
    orders,
    fetchOrders,
    updateOrderStatus,
    getOrderStats,
    loading: ordersLoading,
  } = useOrderStore();

  const {
    lowStockItems,
    fetchLowStockProducts,
    updateInventory,
    loading: inventoryLoading
  } = useInventoryStore();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEdit, setIsEdit] = useState(false);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editId, setEditId] = useState(null);
  const [trackingForm, setTrackingForm] = useState({});
  const [imageUploadError, setImageUploadError] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchLowStockProducts();
  }, [fetchProducts, fetchOrders, fetchLowStockProducts]);

  // Handle product form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductForm((f) => ({
      ...f,
      [name]: value,
    }));
  };

  // Add or Edit product
  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...productForm,
      price: parseFloat(productForm.price),
      quantityAvailable: parseInt(productForm.quantityAvailable),
      image: productForm.optimizedImageUrl || productForm.image
    };

    if (isEdit) {
      updateProduct(editId, productData);
    } else {
      addProduct(productData);
    }
    
    setProductForm(emptyProduct);
    setIsEdit(false);
    setEditId(null);
  };

  const handleImageUpload = (imageData) => {
    if (imageData) {
      setProductForm(prev => ({
        ...prev,
        image: imageData.optimizedUrl,
        cloudinaryPublicId: imageData.publicId,
        optimizedImageUrl: imageData.optimizedUrl
      }));
      setImageUploadError("");
    } else {
      setProductForm(prev => ({
        ...prev,
        image: "",
        cloudinaryPublicId: "",
        optimizedImageUrl: ""
      }));
    }
  };

  const handleImageUploadError = (error) => {
    setImageUploadError(error);
  };

  const handleBulkUploadComplete = (result) => {
    if (result.successCount > 0) {
      // Refresh products list
      fetchProducts();
    }
  };

  const handleEdit = (product) => {
    setProductForm({
      ...product,
      price: product.price.toString(),
      quantityAvailable: product.quantityAvailable.toString()
    });
    setIsEdit(true);
    setEditId(product.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this product?")) {
      deleteProduct(id);
    }
  };

  const handleTrackingUpdate = async (orderId, trackingNumber) => {
    try {
      await updateOrderStatus(orderId, 'shipped', { trackingNumber });
      setTrackingForm(prev => ({ ...prev, [orderId]: '' }));
    } catch (error) {
      console.error('Error updating tracking:', error);
    }
  };

  const handleInventoryUpdate = async (productId, newQuantity) => {
    try {
      await updateInventory(productId, newQuantity, 'set');
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  };

  const stats = getOrderStats();

  const TabButton = ({ id, label, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-6 py-3 font-medium rounded-lg transition-all ${
        active
          ? 'bg-organic-primary text-white'
          : 'bg-white text-organic-text hover:bg-organic-background'
      }`}
    >
      {label}
    </button>
  );

  if (productsLoading || ordersLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-organic-background py-8">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-organic-text mb-8">Admin Dashboard</h1>

        {/* Seed Button */}
        <AdminSeedButton />

        {/* Artisan Seed Button */}
        <ArtisanSeedButton />

        {/* Algolia Search Management */}
        <AdminAlgoliaSync />

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          <TabButton 
            id="dashboard" 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            id="products" 
            label="Products" 
            active={activeTab === 'products'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            id="bulk-upload" 
            label="Bulk Upload" 
            active={activeTab === 'bulk-upload'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            id="orders" 
            label="Orders" 
            active={activeTab === 'orders'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            id="inventory" 
            label="Inventory" 
            active={activeTab === 'inventory'} 
            onClick={setActiveTab} 
          />
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-yellow-800">Low Stock Alert</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lowStockItems.slice(0, 6).map(item => (
                    <div key={item.id} className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-organic-text">{item.name}</h4>
                      <p className="text-sm text-red-600">Only {item.quantity || item.quantityAvailable} left</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-organic-text mb-2">Total Products</h3>
                <p className="text-3xl font-bold text-organic-primary">{products.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-organic-text mb-2">Total Orders</h3>
                <p className="text-3xl font-bold text-organic-primary">{stats.total}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-organic-text mb-2">Revenue</h3>
                <p className="text-3xl font-bold text-organic-highlight">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-organic-text mb-2">Processing Orders</h3>
                <p className="text-3xl font-bold text-yellow-600">{stats.processing}</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-organic-text mb-4">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Order ID</th>
                      <th className="text-left py-2">Customer</th>
                      <th className="text-left py-2">Total</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b">
                        <td className="py-2 font-mono text-sm">{order.orderNumber || order.id.slice(0, 8)}</td>
                        <td className="py-2">{order.userEmail}</td>
                        <td className="py-2 font-semibold">{formatCurrency(order.total)}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-2 text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-2">
                          {order.status === 'processing' && (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Tracking #"
                                value={trackingForm[order.id] || ''}
                                onChange={(e) => setTrackingForm(prev => ({
                                  ...prev,
                                  [order.id]: e.target.value
                                }))}
                                className="px-2 py-1 border rounded text-xs w-24"
                              />
                              <button
                                onClick={() => handleTrackingUpdate(order.id, trackingForm[order.id])}
                                className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                              >
                                Ship
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            {/* Product Form */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-organic-text mb-4">
                {isEdit ? "Edit Product" : "Add New Product"}
              </h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                <input
                  name="name"
                  value={productForm.name}
                  onChange={handleChange}
                  placeholder="Product Name"
                  className="border rounded-lg p-3 focus:ring-2 focus:ring-organic-primary focus:border-transparent"
                  required
                  data-cy="product-name"
                />
                <input
                  name="category"
                  value={productForm.category}
                  onChange={handleChange}
                  list="categories"
                  placeholder="Select or enter category"
                  className="border rounded-lg p-3 focus:ring-2 focus:ring-organic-primary focus:border-transparent"
                  required
                  data-cy="product-category"
                />
                <datalist id="categories">
                  <option value="pickle">Pickles</option>
                  <option value="honey">Honey</option>
                  <option value="grains">Grains</option>
                  <option value="spices">Spices</option>
                  <option value="dairy">Dairy</option>
                </datalist>
                <input
                  name="price"
                  value={productForm.price}
                  onChange={handleChange}
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Price"
                  className="border rounded-lg p-3 focus:ring-2 focus:ring-organic-primary focus:border-transparent"
                  required
                  data-cy="product-price"
                />
                <input
                  name="quantityAvailable"
                  value={productForm.quantityAvailable}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  placeholder="Available Quantity"
                  className="border rounded-lg p-3 focus:ring-2 focus:ring-organic-primary focus:border-transparent"
                  required
                  data-cy="product-quantity"
                />
                <input
                  name="sku"
                  value={productForm.sku || ''}
                  onChange={handleChange}
                  placeholder="Product SKU"
                  className="border rounded-lg p-3 focus:ring-2 focus:ring-organic-primary focus:border-transparent"
                />
                
                {/* Image Upload Section */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image
                  </label>
                  <ImageUpload
                    onImageUploaded={handleImageUpload}
                    onError={handleImageUploadError}
                    currentImage={productForm.image}
                    folder="ramro/products"
                  />
                  {imageUploadError && (
                    <p className="mt-2 text-sm text-red-600" data-cy="file-type-error">{imageUploadError}</p>
                  )}
                </div>
                
                <textarea
                  name="description"
                  value={productForm.description}
                  onChange={handleChange}
                  placeholder="Product Description"
                  className="border rounded-lg p-3 col-span-1 md:col-span-2 focus:ring-2 focus:ring-organic-primary focus:border-transparent"
                  rows={3}
                  required
                  data-cy="product-description"
                />
                <button
                  type="submit"
                  className="bg-organic-primary text-white px-6 py-3 rounded-lg hover:opacity-90 col-span-1 md:col-span-2 font-semibold"
                  data-cy="save-product-button"
                >
                  {isEdit ? "Update Product" : "Add Product"}
                </button>
              </form>
            </div>

            {/* Products List */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-organic-text mb-4">Products ({products.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Image</th>
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Category</th>
                      <th className="text-left py-2">Price</th>
                      <th className="text-left py-2">Stock</th>
                      <th className="text-left py-2">SKU</th>
                      <th className="text-left py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b">
                        <td className="py-2">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-12 h-12 object-cover rounded"
                          />
                        </td>
                        <td className="py-2 font-medium">{product.name}</td>
                        <td className="py-2 capitalize">{product.category}</td>
                        <td className="py-2 font-semibold">{formatCurrency(product.price)}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.quantityAvailable > 10 ? 'bg-green-100 text-green-800' :
                            product.quantityAvailable > 0 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {product.quantityAvailable}
                          </span>
                        </td>
                        <td className="py-2 text-sm text-gray-600">{product.sku || 'N/A'}</td>
                        <td className="py-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title="Edit Product"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-1 text-red-600 hover:text-red-800"
                              title="Delete Product"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Upload Tab */}
        {activeTab === 'bulk-upload' && (
          <div className="space-y-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-yellow-800 mb-2" data-cy="bulk-upload-tab">
                📦 Bulk Product Upload
              </h2>
              <p className="text-yellow-700">
                Upload multiple products at once using a CSV file. This feature allows you to add hundreds of products in minutes.
              </p>
            </div>
            
            <BulkProductUpload onUploadComplete={handleBulkUploadComplete} />
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-organic-text mb-4">Orders ({orders.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Order ID</th>
                    <th className="text-left py-2">Customer</th>
                    <th className="text-left py-2">Items</th>
                    <th className="text-left py-2">Total</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Tracking</th>
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="py-2 font-mono text-sm">{order.orderNumber || order.id.slice(0, 8)}</td>
                      <td className="py-2">{order.userEmail}</td>
                      <td className="py-2">
                        <div className="text-sm">
                          {order.items && order.items.slice(0, 2).map((item, idx) => (
                            <div key={idx}>{item.name} × {item.quantity}</div>
                          ))}
                          {order.items && order.items.length > 2 && (
                            <div className="text-gray-500">+{order.items.length - 2} more</div>
                          )}
                        </div>
                      </td>
                      <td className="py-2 font-semibold">{formatCurrency(order.total)}</td>
                      <td className="py-2">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-organic-primary focus:border-transparent"
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-2 text-sm">
                        {order.trackingNumber || 'N/A'}
                      </td>
                      <td className="py-2 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2">
                        <button className="text-organic-primary hover:text-organic-text font-medium">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="space-y-8">
            {/* Low Stock Items */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-organic-text mb-4">
                Low Stock Items ({lowStockItems.length})
              </h2>
              {inventoryLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : lowStockItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>All products are well stocked! 🎉</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Product</th>
                        <th className="text-left py-2">Current Stock</th>
                        <th className="text-left py-2">Update Stock</th>
                        <th className="text-left py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockItems.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-2">
                            <div className="flex items-center gap-3">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">{item.sku}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-2">
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                              {item.quantityAvailable || item.quantity}
                            </span>
                          </td>
                          <td className="py-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                placeholder="New quantity"
                                className="w-24 px-2 py-1 border rounded text-sm"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleInventoryUpdate(item.id, parseInt(e.target.value));
                                    e.target.value = '';
                                  }
                                }}
                              />
                            </div>
                          </td>
                          <td className="py-2">
                            <button
                              onClick={() => {
                                const newQuantity = prompt('Enter new stock quantity:', item.quantityAvailable);
                                if (newQuantity !== null) {
                                  handleInventoryUpdate(item.id, parseInt(newQuantity));
                                }
                              }}
                              className="text-organic-primary hover:text-organic-text font-medium text-sm"
                            >
                              Quick Update
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}