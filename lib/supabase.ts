import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client for browser/client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (with service role key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Database types
export interface Product {
  id: number;
  external_id: string;
  title: string;
  description: string;
  brand: string;
  category: string;
  material: string;
  price: number;
  old_price?: number;
  discount?: number;
  image_url: string;
  product_url: string;
  shop: string;
  in_stock: boolean;
  stock_count?: number;
  sku?: string;
  keywords: string[];
  path: string;
  feed_source: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  category: string;
  product_count: number;
  min_price: number;
  max_price: number;
  avg_price: number;
}

export interface Brand {
  brand: string;
  product_count: number;
}

export interface Material {
  material: string;
  product_count: number;
}
