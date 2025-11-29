import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Customer } from '../types';
import { UserPlus, Search, Mail, Phone, MapPin, ShoppingBag, Loader2 } from 'lucide-react';

export const Customers: React.FC = () => {
  const { customers, addCustomer, loading } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Customer>>({ name: '', email: '', phone: '', address: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await addCustomer({
      ...formData,
      id: '', // Backend assigns ID
      totalSpent: 0
    } as Customer);
    setIsSubmitting(false);
    setIsModalOpen(false);
    setFormData({ name: '', email: '', phone: '', address: '' });
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-3xl font-bold text-white">Customers</h2>
           <p className="text-gray-400">Manage customer profiles and history</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-accent-600 hover:bg-accent-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-accent-500/20"
        >
          <UserPlus size={20} />
          Add Customer
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <input 
          type="text" 
          placeholder="Search customers..." 
          className="w-full max-w-md bg-dark-800 border border-dark-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-accent-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-accent-500" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map(customer => (
            <div key={customer.id} className="bg-dark-800 rounded-xl border border-dark-700 p-6 hover:border-accent-500/50 transition-colors group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{customer.name}</h3>
                  <p className="text-accent-400 text-sm font-medium">VIP Member</p>
                </div>
              </div>
              
              <div className="space-y-3 text-gray-400 text-sm mb-6">
                <div className="flex items-center gap-3">
                  <Mail size={16} />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} />
                  <span className="truncate">{customer.address}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-dark-700 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-300">
                   <ShoppingBag size={16} />
                   <span className="text-sm">Total Spent</span>
                </div>
                <span className="text-lg font-bold text-white">₹{customer.totalSpent.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Simple Modal implementation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-dark-800 rounded-xl border border-dark-700 p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Add New Customer</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                placeholder="Full Name" required
                className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent-500"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <input 
                placeholder="Email" type="email" required
                className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent-500"
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <input 
                placeholder="Phone" required
                className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent-500"
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
              />
              <input 
                placeholder="Address" required
                className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent-500"
                value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
              />
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-accent-600 text-white px-4 py-2 rounded-lg hover:bg-accent-500 flex items-center gap-2">
                  {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
