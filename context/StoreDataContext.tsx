import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    Product,
    Category,
    Order,
    StoreSettings,
    Banner
} from '../types';
import { PRODUCTS as DEFAULT_PRODUCTS, CATEGORIES as DEFAULT_CATEGORIES } from '../constants';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface StoreDataContextType {
    products: Product[];
    categories: Category[];
    orders: Order[];
    banners: Banner[];
    settings: StoreSettings | null;
    isLoading: boolean;
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;

    // Banners
    addBanner: (banner: Omit<Banner, 'id'>) => Promise<void>;
    updateBanner: (id: string, banner: Partial<Banner>) => Promise<void>;
    deleteBanner: (id: string) => Promise<void>;

    // Categories
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
    const [banners, setBanners] = useState<Banner[]>([]);
    const [settings, setSettings] = useState<StoreSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load data
    const loadData = async () => {
        setIsLoading(true);
        try {
            if (isSupabaseConfigured && supabase) {
                // --- REAL DB MODE ---

                // 1. Categories
                try {
                    const { data: catData, error: catError } = await supabase.from('categories').select('*');
                    if (catError) throw catError;
                    if (catData && catData.length > 0) {
                        setCategories(catData.map(c => ({ id: c.id, name: c.name, icon: c.icon || 'circle' })));
                    } else {
                        setCategories(DEFAULT_CATEGORIES);
                    }
                } catch (e) {
                    console.error('Error loading categories:', e);
                }

                // 2. Products
                try {
                    const { data: prodData, error: prodError } = await supabase.from('products').select('*');
                    if (prodError) throw prodError;

                    if (prodData && prodData.length > 0) {
                        console.log('Loaded products from DB:', prodData.length);
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
                        console.warn('DB empty or RLS blocked. Loading defaults.');
                        // ALERT FOR DEBUGGING (can remove later)
                        // alert('Внимание: Продукты загружены из локального файла (Defaults), а не из базы данных! База пуста или заблокирована.');
                        setProducts(DEFAULT_PRODUCTS);
                    }
                } catch (e) {
                    console.error('Error loading products:', e);
                    alert('Ошибка загрузки продуктов из БД: ' + JSON.stringify(e));
                }

                // 3. Orders
                try {
                    const { data: ordData, error: ordError } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
                    if (ordError) throw ordError;
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
                } catch (e) {
                    console.error('Error loading orders:', e);
                }

                // 4. Banners
                try {
                    const { data: banData } = await supabase.from('banners').select('*').order('sort_order', { ascending: true });
                    if (banData) {
                        setBanners(banData.map(b => ({
                            id: b.id,
                            title: b.title,
                            description: b.description || '',
                            imageUrl: b.image_url,
                            heroImageUrl: b.hero_image_url || undefined,
                            linkUrl: b.link_url || '',
                            buttonText: b.button_text || '',
                            sortOrder: b.sort_order,
                            active: b.active
                        })));
                    }
                } catch (e) {
                    console.error('Error loading banners:', e);
                }

                // 5. Settings (NEVER load admin_password to client!)
                try {
                    const { data: setData, error: setError } = await supabase
                        .from('settings')
                        .select('store_name, telegram_username, banner_interval')
                        .single();
                    if (setError && setError.code !== 'PGRST116') throw setError; // PGRST116 is 'no rows'
                    if (setData) {
                        setSettings({
                            storeName: setData.store_name,
                            telegramUsername: setData.telegram_username,
                            adminPassword: '', // Never loaded from server
                            bannerInterval: setData.banner_interval || 3000
                        });
                    } else {
                        setSettings({
                            storeName: 'Digi Deal',
                            telegramUsername: 'digideal_support',
                            adminPassword: '',
                            bannerInterval: 3000,
                        });
                    }
                } catch (e) {
                    console.error('Error loading settings:', e);
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
                else setSettings({
                    storeName: 'Digi Deal',
                    telegramUsername: 'digideal_support',
                    adminPassword: '',
                    bannerInterval: 3000
                });
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
                store_name: 'Digi Deal',
                telegram_username: 'digideal_support',
                admin_password: '',
                admin_password_hash: '',
                banner_interval: 3000
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
            // Generate ID manually since DB likely expects text ID
            // Simple slug-like ID or timestamp backup
            const cleanTitle = product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const generatedId = cleanTitle ? `${cleanTitle}-${Date.now().toString().slice(-4)}` : `prod-${Date.now()}`;

            const newProduct = {
                id: generatedId,
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
            const { error } = await supabase.from('products').insert([newProduct]);
            if (error) {
                console.error('Error creating product:', error);
                alert('Ошибка создания товара: ' + error.message);
                throw error;
            }
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
                alert('Ошибка обновления продукта: ' + error.message);
                throw error;
            } else {
                // alert('Продукт успешно обновлен в БД!'); 
            }
            // Small delay to ensure DB transaction is finalized before refresh
            await new Promise(resolve => setTimeout(resolve, 500));
            await loadData();
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
            if (newSettings.telegramUsername !== undefined) dbSettings.telegram_username = newSettings.telegramUsername;
            if (newSettings.adminPassword !== undefined) dbSettings.admin_password = newSettings.adminPassword;
            if (newSettings.adminPasswordHash !== undefined) dbSettings.admin_password_hash = newSettings.adminPasswordHash;
            if (newSettings.bannerInterval !== undefined) dbSettings.banner_interval = newSettings.bannerInterval;

            const { error } = await supabase.from('settings').update(dbSettings).eq('id', 1);
            if (error) {
                console.error('Error updating settings:', error);
                throw error;
            }
            await refreshData();
        } else {
            const updated = { ...settings, ...newSettings } as StoreSettings;
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

    // Banners
    const addBanner = async (banner: Omit<Banner, 'id'>) => {
        if (isSupabaseConfigured && supabase) {
            const newId = `banner-${Date.now()}`;
            const dbBanner: Record<string, any> = {
                id: newId,
                title: banner.title,
                description: banner.description,
                image_url: banner.imageUrl,
                link_url: banner.linkUrl,
                button_text: banner.buttonText,
                sort_order: banner.sortOrder,
                active: banner.active
            };
            if (banner.heroImageUrl) dbBanner.hero_image_url = banner.heroImageUrl;
            await supabase.from('banners').insert([dbBanner]);
            await refreshData();
        }
    };

    const updateBanner = async (id: string, update: Partial<Banner>) => {
        if (isSupabaseConfigured && supabase) {
            const dbUpdate: any = {};
            if (update.title !== undefined) dbUpdate.title = update.title;
            if (update.description !== undefined) dbUpdate.description = update.description;
            if (update.imageUrl !== undefined) dbUpdate.image_url = update.imageUrl;
            if (update.heroImageUrl !== undefined) dbUpdate.hero_image_url = update.heroImageUrl;
            if (update.linkUrl !== undefined) dbUpdate.link_url = update.linkUrl;
            if (update.buttonText !== undefined) dbUpdate.button_text = update.buttonText;
            if (update.sortOrder !== undefined) dbUpdate.sort_order = update.sortOrder;
            if (update.active !== undefined) dbUpdate.active = update.active;

            await supabase.from('banners').update(dbUpdate).eq('id', id);
            await refreshData();
        }
    };

    const deleteBanner = async (id: string) => {
        if (isSupabaseConfigured && supabase) {
            await supabase.from('banners').delete().eq('id', id);
            await refreshData();
        }
    };

    return (
        <StoreDataContext.Provider value={{
            products,
            categories,
            orders,
            banners,
            settings,
            isLoading,
            addProduct,
            updateProduct,
            deleteProduct,
            addBanner,
            updateBanner,
            deleteBanner,
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
