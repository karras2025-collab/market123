import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, Order, StoreSettings } from '../types';
import { PRODUCTS as DEFAULT_PRODUCTS, CATEGORIES as DEFAULT_CATEGORIES } from '../constants';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface StoreDataContextType {
    products: Product[];
    categories: Category[];
    orders: Order[];
    settings: StoreSettings;
    isLoading: boolean;
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
    updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<string>;
    updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
    updateSettings: (settings: Partial<StoreSettings>) => Promise<void>;
    refreshData: () => Promise<void>;
    initializeDatabase: () => Promise<void>;
    uploadImage: (file: File) => Promise<string>;
}

const StoreDataContext = createContext<StoreDataContextType | undefined>(undefined);

// LocalStorage keys
const STORAGE_KEYS = {
    products: 'store_products',
    categories: 'store_categories',
    orders: 'store_orders',
    settings: 'store_settings',
};

export const StoreDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
    const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
    const [orders, setOrders] = useState<Order[]>([]);
    const [settings, setSettings] = useState<StoreSettings>({
        storeName: 'Skyress Store',
        telegramUsername: 'rosaalba_prof',
        adminPassword: 'admin123',
    });
    const [isLoading, setIsLoading] = useState(true);

    // Load data
    const loadData = async () => {
        setIsLoading(true);
        try {
            if (isSupabaseConfigured && supabase) {
                // --- REAL DB MODE ---
                // 1. Categories
                const { data: catData } = await supabase.from('categories').select('*');
                if (catData && catData.length > 0) {
                    setCategories(catData.map(c => ({ id: c.id, name: c.name, icon: c.icon || 'circle' })));
                } else {
                    // Fallback if DB empty: use defaults (but purely locally for display until init)
                    setCategories(DEFAULT_CATEGORIES);
                }

                // 2. Products
                const { data: prodData } = await supabase.from('products').select('*');
                if (prodData && prodData.length > 0) {
                    setProducts(prodData.map(p => ({
                        id: p.id,
                        title: p.title,
                        description: p.description || '',
                        category: p.category_id || '',
                        service: p.service || '',
                        tags: p.tags || [],
                        flow: p.flow as any,
                        imageUrl: p.image_url || '',
                        variants: p.variants as any || [],
                        requirements: p.requirements as any || {}
                    })));
                } else {
                    setProducts(DEFAULT_PRODUCTS);
                }

                // 3. Orders
                const { data: ordData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
                if (ordData) {
                    setOrders(ordData.map(o => ({
                        id: o.id,
                        email: o.email || '',
                        telegram: o.telegram,
                        items: o.items as any,
                        status: o.status as any,
                        createdAt: o.created_at
                    })));
                }

                // 4. Settings
                const { data: setData } = await supabase.from('settings').select('*').single();
                if (setData) {
                    setSettings({
                        storeName: setData.store_name,
                        telegramUsername: setData.telegram_username,
                        adminPassword: setData.admin_password
                    });
                }

            } else {
                // --- LOCAL STORAGE MODE ---
                const storedProducts = localStorage.getItem(STORAGE_KEYS.products);
                if (storedProducts) {
                    const parsed = JSON.parse(storedProducts);
                    const custom = parsed.filter((p: any) => p.id.startsWith('prod-'));
                    setProducts([...DEFAULT_PRODUCTS, ...custom]);
                } else {
                    setProducts(DEFAULT_PRODUCTS);
                }

                const storedCategories = localStorage.getItem(STORAGE_KEYS.categories);
                if (storedCategories) {
                    const parsed = JSON.parse(storedCategories);
                    const custom = parsed.filter((c: any) => c.id.startsWith('cat-'));
                    setCategories([...DEFAULT_CATEGORIES, ...custom]);
                } else {
                    setCategories(DEFAULT_CATEGORIES);
                }

                const storedOrders = localStorage.getItem(STORAGE_KEYS.orders);
                if (storedOrders) setOrders(JSON.parse(storedOrders));

                const storedSettings = localStorage.getItem(STORAGE_KEYS.settings);
                if (storedSettings) setSettings(prev => ({ ...prev, ...JSON.parse(storedSettings) }));
            }
        } catch (err) {
            console.error('Error loading data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const refreshData = async () => {
        await loadData();
    };

    // --- INITIALIZE DATABASE ---
    const initializeDatabase = async () => {
        if (!isSupabaseConfigured || !supabase) return;

        setIsLoading(true);
        try {
            // 1. Settings
            await supabase.from('settings').upsert({
                id: 1,
                store_name: 'Skyress Store',
                telegram_username: 'rosaalba_prof',
                admin_password: 'admin123'
            });

            // 2. Categories
            const categoriesToInsert = DEFAULT_CATEGORIES.map(c => ({
                id: c.id,
                name: c.name,
                icon: c.icon
            }));
            await supabase.from('categories').upsert(categoriesToInsert);

            // 3. Products
            const productsToInsert = DEFAULT_PRODUCTS.map(p => ({
                id: p.id,
                title: p.title,
                description: p.description,
                category_id: p.category,
                service: p.service,
                tags: p.tags,
                flow: p.flow,
                image_url: p.imageUrl,
                variants: p.variants,
                requirements: p.requirements
            }));
            await supabase.from('products').upsert(productsToInsert);

            await refreshData();
            alert('База данных успешно инициализирована!');
        } catch (e) {
            console.error('Database initialization failed:', e);
            alert('Ошибка при инициализации БД. Проверьте консоль.');
        } finally {
            setIsLoading(false);
        }
    };

    // Products
    const addProduct = async (product: Omit<Product, 'id'>) => {
        if (isSupabaseConfigured && supabase) {
            const newProduct = {
                title: product.title,
                description: product.description,
                category_id: product.category,
                service: product.service,
                tags: product.tags,
                flow: product.flow,
                image_url: product.imageUrl,
                variants: product.variants,
                requirements: product.requirements
            };
            await supabase.from('products').insert([newProduct]);
            await refreshData();
        } else {
            const newP = { ...product, id: 'prod-' + Date.now() };
            const updated = [newP, ...products];
            setProducts(updated);
            localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(updated));
        }
    };

    const updateProduct = async (id: string, update: Partial<Product>) => {
        if (isSupabaseConfigured && supabase) {
            const dbUpdate: Record<string, any> = {};
            if (update.title !== undefined) dbUpdate.title = update.title;
            if (update.description !== undefined) dbUpdate.description = update.description;
            if (update.category !== undefined) dbUpdate.category_id = update.category;
            if (update.service !== undefined) dbUpdate.service = update.service;
            if (update.tags !== undefined) dbUpdate.tags = update.tags;
            if (update.flow !== undefined) dbUpdate.flow = update.flow;
            if (update.imageUrl !== undefined) dbUpdate.image_url = update.imageUrl;
            if (update.variants !== undefined) dbUpdate.variants = update.variants;
            if (update.requirements !== undefined) dbUpdate.requirements = update.requirements;

            const { error } = await supabase.from('products').update(dbUpdate).eq('id', id);
            if (error) {
                console.error('Error updating product:', error);
                throw error;
            }
            await refreshData();
        } else {
            const updated = products.map(p => p.id === id ? { ...p, ...update } : p);
            setProducts(updated);
            localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(updated));
        }
    };

    const deleteProduct = async (id: string) => {
        if (isSupabaseConfigured && supabase) {
            await supabase.from('products').delete().eq('id', id);
            await refreshData();
        } else {
            const updated = products.filter(p => p.id !== id);
            setProducts(updated);
            localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(updated));
        }
    };

    // Categories
    const addCategory = async (cat: Omit<Category, 'id'>) => {
        if (isSupabaseConfigured && supabase) {
            await supabase.from('categories').insert([{ name: cat.name, icon: cat.icon }]);
            await refreshData();
        } else {
            const newC = { ...cat, id: 'cat-' + Date.now() };
            const updated = [...categories, newC];
            setCategories(updated);
            localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(updated));
        }
    };

    const updateCategory = async (id: string, update: Partial<Category>) => {
        if (isSupabaseConfigured && supabase) {
            await supabase.from('categories').update(update).eq('id', id);
            await refreshData();
        } else {
            const updated = categories.map(c => c.id === id ? { ...c, ...update } : c);
            setCategories(updated);
            localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(updated));
        }
    };

    const deleteCategory = async (id: string) => {
        if (isSupabaseConfigured && supabase) {
            await supabase.from('categories').delete().eq('id', id);
            await refreshData();
        } else {
            const updated = categories.filter(c => c.id !== id);
            setCategories(updated);
            localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(updated));
        }
    };

    // Orders
    const addOrder = async (order: Omit<Order, 'id' | 'createdAt'>): Promise<string> => {
        if (isSupabaseConfigured && supabase) {
            const { data, error } = await supabase.from('orders').insert([{
                email: order.email,
                telegram: order.telegram,
                items: order.items,
                status: 'pending'
            }]).select().single();

            if (error) throw error;
            await refreshData();
            return data.id;
        } else {
            const newOrder = {
                ...order,
                id: 'order-' + Date.now(),
                createdAt: new Date().toISOString()
            };
            const updated = [newOrder, ...orders];
            setOrders(updated);
            localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(updated));
            return newOrder.id;
        }
    };

    const updateOrderStatus = async (id: string, status: Order['status']) => {
        if (isSupabaseConfigured && supabase) {
            await supabase.from('orders').update({ status }).eq('id', id);
            await refreshData();
        } else {
            const updated = orders.map(o => o.id === id ? { ...o, status } : o);
            setOrders(updated);
            localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(updated));
        }
    };

    // Settings
    const updateSettings = async (newSettings: Partial<StoreSettings>) => {
        if (isSupabaseConfigured && supabase) {
            const dbSettings: Record<string, any> = {};
            if (newSettings.storeName !== undefined) dbSettings.store_name = newSettings.storeName;
            if (newSettings.telegramUsername !== undefined) dbSettings.telegram_username = newSettings.telegramUsername;
            if (newSettings.adminPassword !== undefined) dbSettings.admin_password = newSettings.adminPassword;

            const { error } = await supabase.from('settings').update(dbSettings).eq('id', 1);
            if (error) {
                console.error('Error updating settings:', error);
                throw error;
            }
            await refreshData();
        } else {
            const updated = { ...settings, ...newSettings };
            setSettings(updated);
            localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(updated));
        }
    };

    // Upload image to Supabase Storage
    const uploadImage = async (file: File): Promise<string> => {
        if (!isSupabaseConfigured || !supabase) {
            throw new Error('Supabase не настроен. Загрузка изображений недоступна.');
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error } = await supabase.storage.from('products').upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        });

        if (error) {
            console.error('Upload error:', error);
            throw error;
        }

        const { data } = supabase.storage.from('products').getPublicUrl(fileName);
        return data.publicUrl;
    };

    return (
        <StoreDataContext.Provider value={{
            products,
            categories,
            orders,
            settings,
            isLoading,
            addProduct,
            updateProduct,
            deleteProduct,
            addCategory,
            updateCategory,
            deleteCategory,
            addOrder,
            updateOrderStatus,
            updateSettings,
            refreshData,
            initializeDatabase,
            uploadImage,
        }}>
            {children}
        </StoreDataContext.Provider>
    );
};

export const useStoreData = (): StoreDataContextType => {
    const context = useContext(StoreDataContext);
    if (!context) {
        throw new Error('useStoreData must be used within a StoreDataProvider');
    }
    return context;
};
