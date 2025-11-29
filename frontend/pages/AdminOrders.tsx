import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ClipboardList, Search, Filter, Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { invoices } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter(inv => 
    inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Customer Orders</h2>
          <p className="text-gray-400">Manage and view all incoming orders</p>
        </div>
      </div>

      <div className="bg-dark-800 p-4 rounded-xl border border-dark-700 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder="Search by Order ID or Customer Name..." 
            className="w-full bg-dark-900 border border-dark-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-accent-500 placeholder-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-dark-900 border border-dark-700 text-gray-300 rounded-lg hover:text-white transition-colors">
          <Filter size={18} />
          <span className="hidden sm:inline">Filter</span>
        </button>
      </div>

      <div className="space-y-4">
        {filteredInvoices.length === 0 ? (
           <div className="text-center py-12 text-gray-500 bg-dark-800 rounded-xl border border-dark-700">
             <ClipboardList size={48} className="mx-auto mb-4 opacity-20" />
             <p>No orders found.</p>
           </div>
        ) : (
          filteredInvoices.map(invoice => (
            <div key={invoice.id} className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden hover:border-accent-500/30 transition-colors">
              <div className="p-4 border-b border-dark-700 bg-dark-900/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-accent-500/10 flex items-center justify-center text-accent-400">
                     <ClipboardList size={20} />
                   </div>
                   <div>
                     <h3 className="text-white font-bold">{invoice.id}</h3>
                     <p className="text-xs text-gray-400 flex items-center gap-1">
                       <Clock size={10} /> {new Date(invoice.date).toLocaleString()}
                     </p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border ${
                    invoice.status === 'Completed' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  }`}>
                    {invoice.status === 'Completed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {invoice.status || 'Completed'}
                  </div>
                  <span className="text-xl font-bold text-white">₹{invoice.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-300">
                   <User size={16} className="text-gray-500" />
                   Customer: <span className="text-white font-medium">{invoice.customerName}</span>
                </div>

                <div className="bg-dark-900/50 rounded-lg p-3">
                  <div className="space-y-2">
                    {invoice.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-dark-800 rounded border border-dark-700 overflow-hidden">
                             <img src={item.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-gray-300">{item.quantity} x {item.name}</span>
                        </div>
                        <span className="text-gray-400">₹{item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-dark-700 flex justify-end gap-6 text-sm">
                     <div className="flex justify-between w-24">
                       <span className="text-gray-500">Subtotal</span>
                       <span className="text-gray-300">₹{invoice.subtotal.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between w-24">
                       <span className="text-gray-500">Tax</span>
                       <span className="text-gray-300">₹{invoice.tax.toFixed(2)}</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};