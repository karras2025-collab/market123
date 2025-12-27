import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database types
export interface DbCategory {
  id: string;
  name: string;
  icon: string | null;
  created_at: string;
}

export interface DbProduct {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  service: string | null;
  tags: string[];
  flow: string;
  image_url: string | null;
  variants: { id: string; name: string; priceDisplay?: string }[];
  requirements: {
    needsAccountEmail?: boolean;
    needsRegion?: boolean;
    needsPlanTerm?: boolean;
    needsInviteLink?: boolean;
    needsAdditionalComment?: boolean;
  };
  created_at: string;
}

export interface DbOrder {
  id: string;
  email: string | null;
  telegram: string | null;
  items: {
    productId: string;
    productTitle: string;
    variantId: string;
    variantName: string;
  }[];
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
}

export interface DbSettings {
  id: number;
  store_name: string;
  telegram_username: string;
  admin_password: string;
}
