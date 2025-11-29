
import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Search, Filter, ShoppingBag, ShoppingCart, X, Plus, Minus, Check, CreditCard } from 'lucide-react';
import { CartItem, Product } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const CustomerShop: React.FC = () => {
  const { products, createInvoice, user } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    if (product.stock === 0) return;
    
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        // Prevent adding more than available stock
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
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

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cart]);

  const processOrder = async () => {
    await createInvoice({
      id: '', // Backend assigns ID
      customerName: user?.name || 'Guest Customer',
      date: new Date().toISOString(),
      items: cart,
      subtotal: cartTotal,
      tax: cartTotal * 0.10, // 10% tax
      discount: 0,
      total: cartTotal * 1.10,
      status: 'Pending'
    });

    setIsCheckingOut(false);
    setCart([]);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setIsCartOpen(false);
    }, 3000);
  };

  const handleRazorpayPayment = () => {
    setIsCheckingOut(true);
    const totalAmount = cartTotal * 1.10;
    const RAZORPAY_KEY_ID = "rzp_test_placeholder"; // REPLACE THIS WITH YOUR ACTUAL KEY

    // DEMO FALLBACK: If key is placeholder, simulate success
    if (RAZORPAY_KEY_ID === "rzp_test_placeholder") {
      setTimeout(() => {
        const confirmDemo = window.confirm(
          "Demo Mode: No valid Razorpay Key detected.\n\nClick OK to simulate a successful payment.\nClick Cancel to abort."
        );
        if (confirmDemo) {
          processOrder();
        } else {
          setIsCheckingOut(false);
        }
      }, 500);
      return;
    }
    
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: Math.round(totalAmount * 100), // Amount in paise
      currency: "INR",
      name: "Nexus Store",
      description: "Purchase Transaction",
      image: "https://cdn-icons-png.flaticon.com/512/4403/4403548.png",
      handler: async function (response: any) {
        // Payment Success
        await processOrder();
      },
      prefill: {
        name: user?.name || "Customer",
        email: user?.email || "customer@example.com",
        contact: "9999999999"
      },
      theme: {
        color: "#10b981"
      },
      modal: {
        ondismiss: function() {
          setIsCheckingOut(false);
        }
      }
    };

    try {
      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded. Please check internet connection.");
        setIsCheckingOut(false);
        return;
      }
      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response: any){
          alert("Payment Failed: " + response.error.description);
          setIsCheckingOut(false);
      });
      rzp1.open();
    } catch (error) {
      console.error("Razorpay Error", error);
      alert("Something went wrong initializing payment.");
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Shop Products</h2>
          <p className="text-gray-400">Explore our latest collection</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCartOpen(true)}
          className="relative bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
        >
          <ShoppingCart size={20} />
          <span className="hidden sm:inline">View Cart</span>
          {cart.length > 0 && (
            <motion.span 
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-dark-900"
            >
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </motion.span>
          )}
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="bg-dark-800 p-4 rounded-xl border border-dark-700 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full bg-dark-900 border border-dark-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-emerald-500 placeholder-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-dark-900 border border-dark-700 text-gray-300 rounded-lg hover:text-white transition-colors">
          <Filter size={18} />
          <span className="hidden sm:inline">Filter</span>
        </button>
      </div>

      {/* Products Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {filteredProducts.map(product => {
             const cartItem = cart.find(c => c.id === product.id);
             const quantityInCart = cartItem ? cartItem.quantity : 0;
             const isOutOfStock = product.stock === 0;
             const isMaxedOut = quantityInCart >= product.stock;

             return (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={product.id} 
                className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden group hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 flex flex-col h-full"
              >
                <div className="h-48 bg-dark-900 relative overflow-hidden">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80'}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-dark-900">
                        <ShoppingBag size={48} className="text-dark-700" />
                      </div>
                    )}

                    <div className="absolute top-3 left-3">
                      <span className="bg-dark-800/90 backdrop-blur text-gray-300 text-xs px-2 py-1 rounded-md border border-dark-700">
                        {product.category}
                      </span>
                    </div>
                    
                    {product.stock <= 5 && product.stock > 0 && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-md font-bold border border-red-500/20">
                          Only {product.stock} left
                        </span>
                      </div>
                    )}
                    
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-dark-900/80 flex items-center justify-center z-10">
                        <span className="text-red-500 font-bold text-lg transform -rotate-12 border-2 border-red-500 px-4 py-2 rounded-lg">
                          OUT OF STOCK
                        </span>
                      </div>
                    )}
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-white text-lg mb-1 truncate" title={product.name}>{product.name}</h3>
                    <p className="text-gray-500 text-xs mb-4">By {product.supplier}</p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xl font-bold text-emerald-400">₹{product.price.toFixed(2)}</span>
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addToCart(product)}
                        disabled={isOutOfStock || isMaxedOut}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isOutOfStock || isMaxedOut
                          ? 'bg-dark-700 text-gray-500 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {isMaxedOut && !isOutOfStock ? 'Max Added' : 'Add to Cart'}
                      </motion.button>
                    </div>
                </div>
              </motion.div>
          )})}
        </AnimatePresence>
      </motion.div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
          <p>No products found matching your criteria.</p>
        </div>
      )}

      {/* Shopping Cart Modal */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-md bg-dark-800 h-full border-l border-dark-700 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-dark-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShoppingCart size={24} /> Your Cart
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {successMsg ? (
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-emerald-400 space-y-3"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Check size={32} />
                    </div>
                    <h3 className="text-xl font-bold">Payment Successful!</h3>
                    <p className="text-gray-400 text-center">Thank you for your purchase.</p>
                  </motion.div>
                ) : cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
                    <ShoppingBag size={48} className="opacity-20" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={item.id} 
                      className="flex gap-4 bg-dark-900/50 p-3 rounded-lg border border-dark-700"
                    >
                      <div className="w-16 h-16 bg-dark-800 rounded-md overflow-hidden flex-shrink-0 border border-dark-700">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{item.name}</h4>
                        <p className="text-emerald-400 text-sm font-bold">₹{item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 bg-dark-800 rounded hover:bg-dark-700 text-gray-400"><Minus size={12} /></button>
                          <span className="text-white text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 bg-dark-800 rounded hover:bg-dark-700 text-gray-400"><Plus size={12} /></button>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-end">
                        <button onClick={() => updateQuantity(item.id, -item.quantity)} className="text-gray-500 hover:text-red-400"><X size={16} /></button>
                        <p className="text-white font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {!successMsg && (
                <div className="p-6 bg-dark-900/80 border-t border-dark-700 backdrop-blur">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white font-bold">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400">Tax (10%)</span>
                    <span className="text-white font-bold">₹{(cartTotal * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-6 pt-4 border-t border-dark-700">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-xl font-bold text-emerald-400">₹{(cartTotal * 1.1).toFixed(2)}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <motion.button 
                      whileTap={{ scale: 0.98 }}
                      onClick={handleRazorpayPayment}
                      disabled={cart.length === 0 || isCheckingOut}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex justify-center gap-2 items-center"
                    >
                      <CreditCard size={20} />
                      {isCheckingOut ? 'Processing...' : 'Pay with Razorpay'}
                    </motion.button>
                    
                    <div className="text-center text-xs text-gray-500">
                      Secure payment via Razorpay (Demo)
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
