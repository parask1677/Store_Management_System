
import React from 'react';
import { useData } from '../context/DataContext';
import { Clock, Package, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export const CustomerOrders: React.FC = () => {
  const { invoices, user } = useData();

  // Filter invoices for the logged-in customer
  const myOrders = invoices.filter(inv => inv.customerName === user?.name);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-dark-700 text-gray-400 border-dark-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">My Orders</h2>
        <p className="text-gray-400">Track and view your purchase history</p>
      </div>

      <div className="space-y-4">
        {myOrders.length === 0 ? (
          <div className="bg-dark-800 rounded-xl border border-dark-700 p-12 text-center">
            <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
              <Package size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Orders Yet</h3>
            <p className="text-gray-400">You haven't placed any orders with us yet.</p>
          </div>
        ) : (
          myOrders.map(invoice => (
            <div key={invoice.id} className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden hover:border-emerald-500/30 transition-colors">
              <div className="p-6 border-b border-dark-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-900/30">
                <div>
                   <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                     <FileText size={16} />
                     <span>{invoice.id}</span>
                   </div>
                   <div className="flex items-center gap-2 text-gray-400 text-sm">
                     <Clock size={14} />
                     <span>{new Date(invoice.date).toLocaleDateString()} at {new Date(invoice.date).toLocaleTimeString()}</span>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Total Amount</p>
                    <p className="text-xl font-bold text-white">₹{invoice.total.toFixed(2)}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getStatusColor(invoice.status)}`}>
                    {invoice.status === 'Completed' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    {invoice.status || 'Pending'}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Items Purchased</h4>
                <div className="space-y-2">
                  {invoice.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 hover:bg-dark-700/30 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-dark-700 rounded-md flex items-center justify-center text-gray-400 overflow-hidden border border-dark-600">
                          {item.image ? (
                             <img src={item.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                             <Package size={16} />
                          )}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{item.name}</p>
                          <p className="text-gray-500 text-xs">{item.category}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <span className="text-gray-400">{item.quantity} x </span>
                        <span className="text-white font-medium">₹{item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-dark-700 flex justify-end gap-8 text-sm">
                  <div className="flex justify-between w-32 text-gray-400">
                    <span>Subtotal</span>
                    <span>₹{invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-32 text-gray-400">
                    <span>Tax</span>
                    <span>₹{invoice.tax.toFixed(2)}</span>
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
