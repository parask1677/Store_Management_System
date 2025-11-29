import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, ShieldCheck, Loader2, UserPlus, ArrowLeft, Phone, MapPin } from 'lucide-react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState<'admin' | 'customer'>('customer');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simple Validation
    if (role === 'customer' && (!phone || !address)) {
        setError('Please fill in all customer details');
        setIsLoading(false);
        return;
    }

    await new Promise(resolve => setTimeout(resolve, 800));

    // Pass phone and address to register function
    const success = await register(name, email, role, phone, address);
    
    if (success) {
      if (role === 'admin') navigate('/');
      else navigate('/shop');
    } else {
      setError('Registration failed. Try again.');
    }
    setIsLoading(false);
  };

  const themeColor = role === 'admin' ? 'accent' : 'emerald';
  const themeBg = role === 'admin' ? 'bg-accent-600' : 'bg-emerald-600';
  const themeText = role === 'admin' ? 'text-accent-400' : 'text-emerald-400';
  const themeShadow = role === 'admin' ? 'shadow-accent-600/25' : 'shadow-emerald-600/25';

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <motion.div 
           animate={{ 
             scale: [1, 1.2, 1],
             opacity: [0.3, 0.5, 0.3] 
           }}
           transition={{ duration: 8, repeat: Infinity }}
           className={`absolute -top-20 -left-20 w-96 h-96 rounded-full blur-3xl transition-colors duration-1000 ${role === 'admin' ? 'bg-accent-600/20' : 'bg-emerald-600/20'}`}
         />
         <motion.div 
           animate={{ 
             scale: [1, 1.1, 1],
             opacity: [0.3, 0.5, 0.3] 
           }}
           transition={{ duration: 8, repeat: Infinity, delay: 4 }}
           className={`absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl transition-colors duration-1000 ${role === 'admin' ? 'bg-purple-600/20' : 'bg-teal-600/20'}`}
         />
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative z-10 w-full max-w-md bg-dark-800/80 backdrop-blur-xl border border-dark-700 rounded-2xl shadow-2xl p-8"
      >
        <Link to="/login" className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>

        <div className="text-center mb-8 pt-4">
          <motion.div 
            layout
            className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg transition-colors duration-500 ${themeBg}`}
          >
            <UserPlus className="text-white" size={32} />
          </motion.div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 mt-2">Join KP Store as {role === 'admin' ? 'an Admin' : 'a Customer'}</p>
        </div>

        {/* Role Toggles */}
        <div className="flex bg-dark-900/50 p-1 rounded-lg mb-6 border border-dark-700 relative">
          <motion.div 
            layoutId="activeTab"
            className={`absolute top-1 bottom-1 rounded-md shadow-lg ${role === 'customer' ? 'left-1 w-[calc(50%-4px)]' : 'left-[calc(50%+2px)] w-[calc(50%-4px)]'} bg-dark-700`}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <button 
            type="button"
            onClick={() => setRole('customer')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 relative z-10 ${role === 'customer' ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <User size={16} /> Customer
          </button>
          <button 
            type="button"
            onClick={() => setRole('admin')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 relative z-10 ${role === 'admin' ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <ShieldCheck size={16} /> Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Full Name</label>
            <div className="relative group">
              <User className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:${themeText} transition-colors`} size={20} />
              <input 
                type="text" 
                required
                className="w-full bg-dark-900/50 border border-dark-600 rounded-lg pl-10 pr-4 py-3 text-white focus:border-opacity-100 focus:outline-none transition-all focus:ring-1 focus:ring-opacity-50"
                style={{ borderColor: role === 'admin' ? '#4f46e5' : '#059669' }} 
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email Address</label>
            <div className="relative group">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:${themeText} transition-colors`} size={20} />
              <input 
                type="email" 
                required
                className="w-full bg-dark-900/50 border border-dark-600 rounded-lg pl-10 pr-4 py-3 text-white focus:border-opacity-100 focus:outline-none transition-all focus:ring-1 focus:ring-opacity-50"
                style={{ borderColor: role === 'admin' ? '#4f46e5' : '#059669' }}
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <div className="relative group">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:${themeText} transition-colors`} size={20} />
              <input 
                type="password" 
                required
                className="w-full bg-dark-900/50 border border-dark-600 rounded-lg pl-10 pr-4 py-3 text-white focus:border-opacity-100 focus:outline-none transition-all focus:ring-1 focus:ring-opacity-50"
                style={{ borderColor: role === 'admin' ? '#4f46e5' : '#059669' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Additional Fields for Customer Registration */}
          <AnimatePresence>
            {role === 'customer' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Phone Number</label>
                  <div className="relative group">
                    <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:${themeText} transition-colors`} size={20} />
                    <input 
                      type="text" 
                      required
                      className="w-full bg-dark-900/50 border border-dark-600 rounded-lg pl-10 pr-4 py-3 text-white focus:border-opacity-100 focus:outline-none transition-all focus:ring-1 focus:ring-opacity-50"
                      style={{ borderColor: '#059669' }}
                      placeholder="+91 99999 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Address</label>
                  <div className="relative group">
                    <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:${themeText} transition-colors`} size={20} />
                    <input 
                      type="text" 
                      required
                      className="w-full bg-dark-900/50 border border-dark-600 rounded-lg pl-10 pr-4 py-3 text-white focus:border-opacity-100 focus:outline-none transition-all focus:ring-1 focus:ring-opacity-50"
                      style={{ borderColor: '#059669' }}
                      placeholder="123 Street Name, City"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={isLoading}
            className={`w-full font-bold py-3 rounded-lg shadow-lg transition-all text-white flex items-center justify-center gap-2 mt-4 ${themeBg} hover:opacity-90 ${themeShadow}`}
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className={`${themeText} hover:underline font-medium`}>
            Sign In
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};