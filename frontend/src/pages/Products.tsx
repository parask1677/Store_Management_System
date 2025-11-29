import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Product } from '../types';
import { Plus, Search, Edit2, Trash2, X, Filter, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Products: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, loading } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({});

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', category: '', price: 0, stock: 0, supplier: '', minStockThreshold: 5, image: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const productData = {
      ...formData,
      // For new products, the ID will be assigned by Backend, but we pass one to avoid TS errors if needed, 
      // though the context/API will likely ignore it for creates.
      id: editingProduct ? editingProduct.id : '', 
      price: Number(formData.price),
      stock: Number(formData.stock),
      minStockThreshold: Number(formData.minStockThreshold),
      image: formData.image || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
    } as Product;

    if (editingProduct) {
      await updateProduct(productData);
    } else {
      await addProduct(productData);
    }
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Inventory</h2>
          <p className="text-gray-400">Manage your product catalog and stock levels</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOpenModal()}
          className="bg-accent-600 hover:bg-accent-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-lg shadow-accent-500/20"
        >
          <Plus size={20} />
          Add Product
        </motion.button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-dark-800 p-4 rounded-xl border border-dark-700 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full bg-dark-900 border border-dark-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-accent-500 placeholder-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-dark-900 border border-dark-700 text-gray-300 rounded-lg hover:text-white transition-colors">
          <Filter size={18} />
          <span>Filter</span>
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 flex justify-center">
             <Loader2 className="animate-spin text-accent-500" size={32} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-dark-900/50 border-b border-dark-700 text-gray-400 text-sm">
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium">Supplier</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                <AnimatePresence>
                  {filteredProducts.map((product, index) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={product.id} 
                      className="hover:bg-dark-700/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-dark-700 overflow-hidden flex-shrink-0 border border-dark-600">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80';
                              }}
                            />
                          </div>
                          <div>
                            <div className="font-medium text-white">{product.name}</div>
                            <div className="text-xs text-gray-500 sm:hidden">ID: {product.id.slice(-4)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-dark-700 text-gray-300 text-xs px-2 py-1 rounded-full border border-dark-600">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">₹{product.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 ${product.stock <= product.minStockThreshold ? 'text-red-400 font-bold' : 'text-emerald-400'}`}>
                          <div className={`w-2 h-2 rounded-full ${product.stock <= product.minStockThreshold ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                          {product.stock}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{product.supplier}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenModal(product)}
                            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
        {!loading && filteredProducts.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No products found.
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-800 rounded-xl border border-dark-700 shadow-2xl w-full max-w-md"
            >
              <div className="flex justify-between items-center p-6 border-b border-dark-700">
                <h3 className="text-xl font-bold text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-accent-500 focus:outline-none"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Image URL</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-accent-500 focus:outline-none"
                      placeholder="https://example.com/image.jpg"
                      value={formData.image}
                      onChange={e => setFormData({...formData, image: e.target.value})}
                    />
                    {formData.image && (
                      <div className="w-10 h-10 rounded bg-dark-700 flex-shrink-0 overflow-hidden border border-dark-600">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-accent-500 focus:outline-none"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Supplier</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-accent-500 focus:outline-none"
                      value={formData.supplier}
                      onChange={e => setFormData({...formData, supplier: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Price</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      step="0.01"
                      className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-accent-500 focus:outline-none"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Stock</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-accent-500 focus:outline-none"
                      value={formData.stock}
                      onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Min Alert</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-accent-500 focus:outline-none"
                      value={formData.minStockThreshold}
                      onChange={e => setFormData({...formData, minStockThreshold: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-accent-600 hover:bg-accent-500 text-white rounded-lg shadow-lg shadow-accent-500/20 transition-colors flex items-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};