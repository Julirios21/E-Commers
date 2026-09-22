export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  is_active: boolean;
  category_id: number;
  category: Category;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  product: Product;
  created_at: string;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  product: Product;
}

export interface Order {
  id: number;
  user_id: number;
  status: OrderStatus;
  total: number;
  shipping_address: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  order_id: number;
  method: string;
  amount: number;
  status: PaymentStatus;
  reference: string | null;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}
