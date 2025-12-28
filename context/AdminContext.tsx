import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AdminContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (password: string) => Promise<boolean>;
    logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if already logged in from session
        const storedAuth = sessionStorage.getItem('admin_authenticated');
        if (storedAuth === 'true') {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = async (password: string): Promise<boolean> => {
        let adminPassword = 'Hctm745520!)))';

        // Try to get password from Supabase
        if (isSupabaseConfigured && supabase) {
            try {
                const { data } = await supabase.from('settings').select('admin_password').single();
                if (data && data.admin_password) {
                    adminPassword = data.admin_password;
                }
            } catch (err) {
                console.error('Failed to fetch admin password from DB:', err);
            }
        } else {
            // Fallback to localStorage
            const storedSettings = localStorage.getItem('store_settings');
            if (storedSettings) {
                try {
                    const settings = JSON.parse(storedSettings);
                    if (settings.adminPassword) {
                        adminPassword = settings.adminPassword;
                    }
                } catch (e) { }
            }
        }

        if (password === adminPassword) {
            setIsAuthenticated(true);
            sessionStorage.setItem('admin_authenticated', 'true');
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('admin_authenticated');
    };

    return (
        <AdminContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = (): AdminContextType => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};
