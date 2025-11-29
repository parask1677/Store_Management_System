import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { CartItem, Product } from '../types';
import { Search, Plus, Minus, ShoppingCart, User, Check, Printer, Image as ImageIcon, Loader2, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const Billing: React.FC = () => {
  const { products, createInvoice, customers } = useData();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]?.name || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.includes(searchTerm)
  );

  const addToCart = (product: Product) => {
    if (product.stock === 0) return;
    
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev; // Cap at stock
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        const maxStock = products.find(p => p.id === id)?.stock || 0;
        return { ...item, quantity: Math.min(newQty, maxStock) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const totals = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% Tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [cart]);

  const finalizeInvoice = async () => {
    await createInvoice({
      id: '', // Backend ID
      customerName: selectedCustomer,
      date: new Date().toISOString(),
      items: [...cart],
      subtotal: totals.subtotal,
      tax: totals.tax,
      discount: 0,
      total: totals.total,
      status: 'Completed'
    });

    setCart([]);
    setShowSuccess(true);
    setIsProcessing(false);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCheckout = async (paymentMethod: 'CASH' | 'ONLINE') => {
    if (cart.length === 0 || !selectedCustomer) return;
    setIsProcessing(true);

    if (paymentMethod === 'CASH') {
      await finalizeInvoice();
    } else {
      const RAZORPAY_KEY_ID = "rzp_test_placeholder"; // REPLACE THIS WITH YOUR ACTUAL KEY

      // DEMO FALLBACK: If key is placeholder, simulate success
      if (RAZORPAY_KEY_ID === "rzp_test_placeholder") {
        setTimeout(() => {
          const confirmDemo = window.confirm(
            "Demo Mode: No valid Razorpay Key detected.\n\nClick OK to simulate a successful POS transaction.\nClick Cancel to abort."
          );
          if (confirmDemo) {
            finalizeInvoice();
          } else {
            setIsProcessing(false);
          }
        }, 500);
        return;
      }

      const options = {
        key: RAZORPAY_KEY_ID, 
        amount: Math.round(totals.total * 100),
        currency: "INR",
        name: "Nexus Store POS",
        description: `Bill for ${selectedCustomer}`,
        image: "https://cdn-icons-png.flaticon.com/512/4403/4403548.png",
        handler: async function (response: any) {
          await finalizeInvoice();
        },
        prefill: {
          name: selectedCustomer,
          contact: "9999999999"
        },
        theme: { color: "#6366f1" },
        modal: {
           ondismiss: function() { setIsProcessing(false); }
        }
      };

      try {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any){
            alert("Payment Failed");
            setIsProcessing(false);
        });
        rzp.open();
      } catch (e) {
        // Fallback for demo if script not loaded
        alert("Razorpay SDK Error. Simulating success.");
        await finalizeInvoice();
      }
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col lg:flex-row gap-6">
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col gap-6 min-h-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">New Sale</h2>
            <p className="text-gray-400 text-sm">Select products to add to cart</p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Scan barcode or search..." 
              className="w-full bg-dark-800 border border-dark-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-accent-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <motion.button 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              key={product.id}
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className={`text-left rounded-xl border transition-all duration-200 flex flex-col overflow-hidden group ${
                product.stock === 0 
                  ? 'bg-dark-800/50 border-dark-700 opacity-50 cursor-not-allowed' 
                  : 'bg-dark-800 border-dark-700 hover:border-accent-500 hover:shadow-lg hover:shadow-accent-500/10'
              }`}
            >
              {/* Image Top */}
              <div className="h-32 w-full bg-dark-900 relative overflow-hidden">
                 {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-dark-700">
                      <ImageIcon size={32} />
                    </div>
                 )}
                 <div className="absolute top-2 right-2">
                   <span className={`text-xs font-bold px-2 py-1 rounded-md ${product.stock < 5 ? 'bg-red-500/90 text-white' : 'bg-dark-900/80 text-white'}`}>
                      {product.stock}
                   </span>
                 </div>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1 w-full">
                <div>
                  <span className="bg-dark-900 text-xs px-2 py-1 rounded text-gray-400">{product.category}</span>
                  <h3 className="font-semibold text-white truncate mt-1" title={product.name}>{product.name}</h3>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-accent-400">₹{product.price.toFixed(2)}</span>
                  <div className="w-8 h-8 rounded-full bg-accent-500/10 flex items-center justify-center text-accent-400 group-hover:bg-accent-500 group-hover:text-white transition-colors">
                    <Plus size={16} />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Cart / Checkout Area */}
      <div className="w-full lg:w-96 bg-dark-800 border border-dark-700 rounded-xl flex flex-col h-full shadow-2xl">
        <div className="p-6 border-b border-dark-700">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShoppingCart size={20} />
            Current Order
          </h3>
          
          <div className="mt-4">
             <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Customer</label>
             <div className="relative">
               <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
               <select 
                className="w-full bg-dark-900 border border-dark-600 text-white text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-accent-500 appearance-none"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
               >
                 <option value="" disabled>Select Customer</option>
                 {customers.map(c => (
                   <option key={c.id} value={c.name}>{c.name}</option>
                 ))}
               </select>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence>
          {cart.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2"
            >
              <ShoppingCart size={48} className="opacity-20" />
              <p>Cart is empty</p>
            </motion.div>
          ) : (
            cart.map(item => (
              <motion.div 
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                key={item.id} 
                className="flex items-center justify-between bg-dark-900 p-3 rounded-lg border border-dark-700"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
                  {item.image && (
                    <img src={item.image} alt="" className="w-10 h-10 rounded object-cover hidden sm:block" />
                  )}
                  <div className="min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">{item.name}</h4>
                    <p className="text-xs text-gray-400">₹{item.price.toFixed(2)}/unit</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-dark-700 rounded text-gray-400 hover:text-white">
                     <Minus size={14} />
                   </button>
                   <span className="text-sm font-bold w-4 text-center text-white">{item.quantity}</span>
                   <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-dark-700 rounded text-gray-400 hover:text-white">
                     <Plus size={14} />
                   </button>
                </div>
                <div className="w-16 text-right font-bold text-white">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </motion.div>
            ))
          )}
          </AnimatePresence>
        </div>

        <div className="p-6 bg-dark-900/50 border-t border-dark-700">
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>₹{totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Tax (10%)</span>
              <span>₹{totals.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-dark-700">
              <span>Total</span>
              <span className="text-accent-400">₹{totals.total.toFixed(2)}</span>
            </div>
          </div>

          {showSuccess ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-500/20 text-emerald-400 text-center py-3 rounded-lg flex items-center justify-center gap-2 border border-emerald-500/30"
            >
              <Check size={20} /> Sale Completed!
            </motion.div>
          ) : (
            <div className="space-y-2">
               <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => handleCheckout('CASH')}
                    disabled={cart.length === 0 || isProcessing}
                    className="px-4 py-3 bg-dark-700 text-white rounded-lg font-bold hover:bg-dark-600 transition-colors flex items-center justify-center gap-2"
                  >
                    Cash
                  </button>
                  <button 
                    onClick={() => handleCheckout('ONLINE')}
                    disabled={cart.length === 0 || isProcessing}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <CreditCard size={18} />}
                    Online
                  </button>
               </div>
               <button className="w-full px-4 py-2 bg-dark-900 border border-dark-700 text-gray-400 rounded-lg font-medium hover:text-white flex items-center justify-center gap-2 text-sm">
                  <Printer size={16} /> Print Invoice
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};