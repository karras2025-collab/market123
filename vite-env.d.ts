/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    readonly VITE_CAPITALIST_MERCHANT_ADDRESS: string;
    readonly VITE_CAPITALIST_SECRET_KEY: string;
    readonly VITE_SITE_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

