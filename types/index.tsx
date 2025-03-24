export interface User {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'vet' | 'shop_owner' | 'admin';
  phone?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Shop {
  id: string;
  name: string;
  owner_id: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  working_hours: {
    open: string;
    close: string;
    days: string[];
  };
  images: string[];
  rating: number;
  verified: boolean;
}

export interface Product {
  id: string;
  shop_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  created_at: string;
}

export interface Veterinarian {
  id: string;
  user_id: string;
  specialization: string[];
  experience_years: number;
  education: string;
  license_number: string;
  available: boolean;
  consultation_fee: number;
  rating: number;
}

export interface Consultation {
  id: string;
  farmer_id: string;
  vet_id: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  scheduled_for: string;
  description: string;
  created_at: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  shop_id: string;
  products: {
    product_id: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string;
  created_at: string;
}