import axios from 'axios';
import { Product, Customer, Invoice, User } from '../types';
import { StorageService } from './storage';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with a short timeout
// If backend doesn't respond in 2s, we switch to fallback immediately
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 2000 
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexus_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * HOF to attempt an API call, and fallback to local storage logic if it fails.
 * This prevents "Network Error" from breaking the app.
 */
const withFallback = async <T>(
  apiCall: () => Promise<{ data: T }>, 
  fallbackLogic: () => Promise<T> | T
): Promise<T> => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    console.warn('⚠️ Backend unreachable. Switching to Offline/Demo Fallback.', error);
    return fallbackLogic();
  }
};

export const ApiService = {
  // --- Auth ---
  login: (email: string, role: 'admin' | 'customer') => 
    withFallback(
      () => api.post('/auth/login', { email, password: '123456', role }),
      () => {
        // Fallback Mock Login
        let name = 'Mock User';
        if (role === 'admin') {
          name = 'Admin User';
        } else {
          // Map known emails to names for better UX
          if (email === 'dev@example.com') name = 'Dev';
          else if (email === 'nitin@example.com') name = 'Nitin';
          else if (email === 'akash@example.com') name = 'Akash';
          else name = 'Guest Customer';
        }

        const mockUser: User = {
          id: role === 'admin' ? 'admin-id-1' : 'cust-id-1',
          name,
          email,
          role
        };
        return { user: mockUser, token: 'mock-offline-token' };
      }
    ),

  // --- Products ---
  getProducts: () => 
    withFallback(
      () => api.get('/products'),
      () => StorageService.getProducts()
    ),

  addProduct: (product: Product) => 
    withFallback(
      () => api.post('/products', product),
      () => {
        const products = StorageService.getProducts();
        const newProduct = { ...product, id: Date.now().toString() };
        products.push(newProduct);
        StorageService.saveProducts(products);
        return newProduct;
      }
    ),

  updateProduct: (product: Product) => 
    withFallback(
      () => api.put(`/products/${product.id}`, product),
      () => {
        const products = StorageService.getProducts();
        const updated = products.map(p => p.id === product.id ? product : p);
        StorageService.saveProducts(updated);
        return product;
      }
    ),

  deleteProduct: (id: string) => 
    withFallback(
      () => api.delete(`/products/${id}`),
      () => {
        const products = StorageService.getProducts();
        StorageService.saveProducts(products.filter(p => p.id !== id));
      }
    ),

  // --- Customers ---
  getCustomers: () => 
    withFallback(
      () => api.get('/customers'),
      () => StorageService.getCustomers()
    ),

  addCustomer: (customer: Customer) => 
    withFallback(
      () => api.post('/customers', customer),
      () => {
        const customers = StorageService.getCustomers();
        const newCustomer = { ...customer, id: Date.now().toString() };
        customers.push(newCustomer);
        StorageService.saveCustomers(customers);
        return newCustomer;
      }
    ),

  // --- Invoices ---
  getInvoices: () => 
    withFallback(
      () => api.get('/invoices'),
      () => StorageService.getInvoices()
    ),

  createInvoice: (invoice: Invoice) => 
    withFallback(
      () => api.post('/invoices', invoice),
      () => {
        // 1. Save the Invoice locally
        const invoices = StorageService.getInvoices();
        const newInvoice = { ...invoice, id: `INV-${Math.floor(1000 + Math.random() * 9000)}` };
        invoices.unshift(newInvoice); // Add to top
        StorageService.saveInvoices(invoices);

        // 2. Update Stock locally
        const products = StorageService.getProducts();
        invoice.items.forEach(item => {
          const prodIndex = products.findIndex(p => p.id === item.id);
          if (prodIndex > -1) {
            products[prodIndex].stock = Math.max(0, products[prodIndex].stock - item.quantity);
          }
        });
        StorageService.saveProducts(products);

        // 3. Update Customer Spend locally
        const customers = StorageService.getCustomers();
        const custIndex = customers.findIndex(c => c.name === invoice.customerName);
        if (custIndex > -1) {
          customers[custIndex].totalSpent += invoice.total;
          StorageService.saveCustomers(customers);
        }

        return newInvoice;
      }
    ),
};