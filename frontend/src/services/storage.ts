import { Product, Customer, Invoice } from '../types';

const INITIAL_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'Wireless Headphones', 
    category: 'Electronics', 
    price: 2499, 
    stock: 45, 
    supplier: 'TechAudio Inc.', 
    minStockThreshold: 10,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'
  },
  { 
    id: '2', 
    name: 'Mechanical Keyboard', 
    category: 'Electronics', 
    price: 4999, 
    stock: 12, 
    supplier: 'KeyMaster', 
    minStockThreshold: 15,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b91add1?w=500&q=80'
  },
  { 
    id: '3', 
    name: 'Ergonomic Mouse', 
    category: 'Electronics', 
    price: 1499, 
    stock: 8, 
    supplier: 'TechAudio Inc.', 
    minStockThreshold: 10,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80'
  },
  { 
    id: '4', 
    name: 'Office Chair', 
    category: 'Furniture', 
    price: 12999, 
    stock: 5, 
    supplier: 'FurniCo', 
    minStockThreshold: 3,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&q=80'
  },
  { 
    id: '5', 
    name: 'USB-C Hub', 
    category: 'Accessories', 
    price: 2999, 
    stock: 100, 
    supplier: 'ConnectWorld', 
    minStockThreshold: 20,
    image: 'https://images.unsplash.com/photo-1625769923337-6a20815f4956?w=500&q=80'
  },
  { 
    id: '6', 
    name: '27" 4K Monitor', 
    category: 'Electronics', 
    price: 28500, 
    stock: 2, 
    supplier: 'ViewMax', 
    minStockThreshold: 5,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80'
  },
  { 
    id: '7', 
    name: 'Smart Watch Gen 5', 
    category: 'Wearables', 
    price: 15999, 
    stock: 25, 
    supplier: 'TimeTech', 
    minStockThreshold: 8,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'
  },
  { 
    id: '8', 
    name: 'Urban Backpack', 
    category: 'Accessories', 
    price: 3499, 
    stock: 30, 
    supplier: 'CarryOn', 
    minStockThreshold: 10,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80'
  },
  { 
    id: '9', 
    name: 'Gaming Controller', 
    category: 'Gaming', 
    price: 4500, 
    stock: 18, 
    supplier: 'GameZone', 
    minStockThreshold: 5,
    image: 'https://images.unsplash.com/photo-1600080972464-8cb882741a99?w=500&q=80'
  },
  { 
    id: '10', 
    name: 'Modern Desk Lamp', 
    category: 'Furniture', 
    price: 1800, 
    stock: 40, 
    supplier: 'Lumina', 
    minStockThreshold: 12,
    image: 'https://images.unsplash.com/photo-1507473888900-52e1ad1d6904?w=500&q=80'
  },
  { 
    id: '11', 
    name: 'Laptop Stand', 
    category: 'Accessories', 
    price: 1200, 
    stock: 60, 
    supplier: 'ErgoLife', 
    minStockThreshold: 15,
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&q=80'
  },
  { 
    id: '12', 
    name: 'Noise Cancelling Earbuds', 
    category: 'Audio', 
    price: 8999, 
    stock: 22, 
    supplier: 'SoundWave', 
    minStockThreshold: 5,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80'
  }
];

const INITIAL_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Dev', email: 'dev@example.com', phone: '9876543210', address: '123 Tech Park, Bangalore', totalSpent: 18498 },
  { id: '2', name: 'Nitin', email: 'nitin@example.com', phone: '9876543211', address: '456 Green Valley, Pune', totalSpent: 8850 },
  { id: '3', name: 'Akash', email: 'akash@example.com', phone: '9876543212', address: '789 Blue Ridge, Mumbai', totalSpent: 0 },
];

const INITIAL_INVOICES: Invoice[] = [
  { 
    id: 'INV-1001', 
    customerName: 'Dev', 
    date: new Date(Date.now() - 86400000 * 2).toISOString(), 
    items: [
      { 
        id: '1', 
        name: 'Wireless Headphones', 
        category: 'Electronics', 
        price: 2499, 
        stock: 45, 
        supplier: 'TechAudio Inc.', 
        minStockThreshold: 10,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        quantity: 2
      },
      { 
        id: '3', 
        name: 'Ergonomic Mouse', 
        category: 'Electronics', 
        price: 1499, 
        stock: 8, 
        supplier: 'TechAudio Inc.', 
        minStockThreshold: 10,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80',
        quantity: 1
      }
    ], 
    subtotal: 6497, 
    tax: 649.7, 
    discount: 0, 
    total: 7146.7,
    status: 'Completed'
  },
  { 
    id: 'INV-1002', 
    customerName: 'Nitin', 
    date: new Date().toISOString(), 
    items: [
       { 
        id: '2', 
        name: 'Mechanical Keyboard', 
        category: 'Electronics', 
        price: 4999, 
        stock: 12, 
        supplier: 'KeyMaster', 
        minStockThreshold: 15,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b91add1?w=500&q=80',
        quantity: 1
      },
      { 
        id: '8', 
        name: 'Urban Backpack', 
        category: 'Accessories', 
        price: 3499, 
        stock: 30, 
        supplier: 'CarryOn', 
        minStockThreshold: 10,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
        quantity: 1
      }
    ], 
    subtotal: 8498, 
    tax: 849.8, 
    discount: 0, 
    total: 9347.8,
    status: 'Pending'
  }
];

export const StorageService = {
  getProducts: (): Product[] => {
    const stored = localStorage.getItem('products');
    if (!stored) {
      localStorage.setItem('products', JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(stored);
  },
  
  saveProducts: (products: Product[]) => {
    localStorage.setItem('products', JSON.stringify(products));
  },

  getCustomers: (): Customer[] => {
    const stored = localStorage.getItem('customers');
    if (!stored) {
      localStorage.setItem('customers', JSON.stringify(INITIAL_CUSTOMERS));
      return INITIAL_CUSTOMERS;
    }
    return JSON.parse(stored);
  },

  saveCustomers: (customers: Customer[]) => {
    localStorage.setItem('customers', JSON.stringify(customers));
  },

  getInvoices: (): Invoice[] => {
    const stored = localStorage.getItem('invoices');
    if (!stored) {
      localStorage.setItem('invoices', JSON.stringify(INITIAL_INVOICES));
      return INITIAL_INVOICES;
    }
    return JSON.parse(stored);
  },

  saveInvoices: (invoices: Invoice[]) => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }
};