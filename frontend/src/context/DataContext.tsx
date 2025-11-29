import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Customer, Invoice, User } from '../types';
import { ApiService } from '../services/api';

interface DataContextType {
  user: User | null;
  products: Product[];
  customers: Customer[];
  invoices: Invoice[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCustomer: (customer: Customer) => Promise<void>;
  createInvoice: (invoice: Invoice) => Promise<void>;
  refreshData: () => Promise<void>;
  login: (email: string, role: 'admin' | 'customer') => Promise<boolean>;
  register: (name: string, email: string, role: 'admin' | 'customer', phone?: string, address?: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  // Check for existing login
  useEffect(() => {
    const storedUser = localStorage.getItem('nexus_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch data on load or user change
  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [prods, custs, invs] = await Promise.all([
        ApiService.getProducts(),
        ApiService.getCustomers(),
        ApiService.getInvoices()
      ]);
      setProducts(prods);
      setCustomers(custs);
      setInvoices(invs);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, role: 'admin' | 'customer'): Promise<boolean> => {
    try {
      const { user, token } = await ApiService.login(email, role);
      
      localStorage.setItem('nexus_token', token);
      localStorage.setItem('nexus_user', JSON.stringify(user));
      setUser(user);
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const register = async (name: string, email: string, role: 'admin' | 'customer', phone?: string, address?: string): Promise<boolean> => {
    try {
      const { user, token } = await ApiService.register(name, email, role, phone, address);
      
      localStorage.setItem('nexus_token', token);
      localStorage.setItem('nexus_user', JSON.stringify(user));
      setUser(user);
      return true;
    } catch (error) {
      console.error("Registration failed", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setProducts([]);
    setInvoices([]);
    setCustomers([]);
    localStorage.removeItem('nexus_user');
    localStorage.removeItem('nexus_token');
  };

  const addProduct = async (product: Product) => {
    try {
      const newProduct = await ApiService.addProduct(product);
      setProducts([...products, newProduct]);
    } catch (e) { console.error(e); }
  };

  const updateProduct = async (product: Product) => {
    try {
      const updated = await ApiService.updateProduct(product);
      setProducts(products.map(p => p.id === product.id ? updated : p));
    } catch (e) { console.error(e); }
  };

  const deleteProduct = async (id: string) => {
    try {
      await ApiService.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (e) { console.error(e); }
  };

  const addCustomer = async (customer: Customer) => {
    try {
      const newCustomer = await ApiService.addCustomer(customer);
      setCustomers([...customers, newCustomer]);
    } catch (e) { console.error(e); }
  };

  const createInvoice = async (invoice: Invoice) => {
    try {
      await ApiService.createInvoice(invoice);
      // Refresh all data to ensure stock and customer balances are synced from backend
      await refreshData(); 
    } catch (e) { console.error(e); }
  };

  return (
    <DataContext.Provider value={{ 
      user, products, customers, invoices, 
      addProduct, updateProduct, deleteProduct, 
      addCustomer, createInvoice, refreshData,
      login, register, logout, loading
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};