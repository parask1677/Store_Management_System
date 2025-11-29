
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  supplier: string;
  minStockThreshold: number;
  image: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalSpent: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Invoice {
  id: string;
  customerName: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

export interface SalesReport {
  date: string;
  revenue: number;
}
