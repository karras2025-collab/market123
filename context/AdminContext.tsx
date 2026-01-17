import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Security constants
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_STORAGE_KEY = 'admin_lockout';
const CODE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

// Telegram config
const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID || '';

interface AdminContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    pending2FA: boolean;
    login: (password: string) => Promise<{ success: boolean; error?: string; lockoutEnd?: number; needs2FA?: boolean }>;
    verify2FA: (code: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    getLockoutInfo: () => { isLocked: boolean; remainingMs: number; attempts: number };
}

interface LockoutData {
    attempts: number;
    lockoutEnd: number | null;
}

interface Pending2FAData {
    code: string;
    expiresAt: number;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// SHA-256 hash function (browser native)
async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Get client fingerprint for logging (hashed for privacy)
async function getClientFingerprint(): Promise<string> {
    const fp = [
        navigator.userAgent,
        navigator.language,
        new Date().getTimezoneOffset().toString(),
        screen.width + 'x' + screen.height
    ].join('|');
    return hashPassword(fp);
}

// Get lockout data from localStorage
function getLockoutData(): LockoutData {
    try {
        const stored = localStorage.getItem(LOCKOUT_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) { }
    return { attempts: 0, lockoutEnd: null };
}

// Save lockout data to localStorage
function saveLockoutData(data: LockoutData): void {
    localStorage.setItem(LOCKOUT_STORAGE_KEY, JSON.stringify(data));
}

// Log login attempt to Supabase
async function logLoginAttempt(success: boolean): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;

    try {
        const ipHash = await getClientFingerprint();
        await supabase.from('login_attempts').insert({
            ip_hash: ipHash,
            success: success
        });
    } catch (err) {
        console.error('Failed to log login attempt:', err);
    }
}

// SERVER-SIDE password verification via Supabase RPC
async function verifyPasswordOnServer(passwordHash: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
        return false;
    }

    try {
        const { data, error } = await supabase.rpc('verify_admin_password', {
            input_hash: passwordHash
        });

        if (error) {
            console.error('RPC error:', error);
            return false;
        }

        return data === true;
    } catch (err) {
        console.error('Failed to verify password on server:', err);
        return false;
    }
}

// Generate 6-digit code
function generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send code via Telegram
async function sendTelegramCode(code: string): Promise<boolean> {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.error('Telegram not configured');
        return false;
    }

    try {
        const message = `🔐 Код для входа в админ-панель: ${code}\n\n⏱️ Действителен 5 минут.`;
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const result = await response.json();
        return result.ok === true;
    } catch (err) {
        console.error('Failed to send Telegram message:', err);
        return false;
    }
}

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [pending2FA, setPending2FA] = useState(false);
    const [pending2FAData, setPending2FAData] = useState<Pending2FAData | null>(null);

    useEffect(() => {
        // Check if already logged in from session
        const storedAuth = sessionStorage.getItem('admin_authenticated');
        if (storedAuth === 'true') {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const getLockoutInfo = (): { isLocked: boolean; remainingMs: number; attempts: number } => {
        const data = getLockoutData();
        const now = Date.now();

        if (data.lockoutEnd && data.lockoutEnd > now) {
            return {
                isLocked: true,
                remainingMs: data.lockoutEnd - now,
                attempts: data.attempts
            };
        }

        // Reset if lockout expired
        if (data.lockoutEnd && data.lockoutEnd <= now) {
            saveLockoutData({ attempts: 0, lockoutEnd: null });
            return { isLocked: false, remainingMs: 0, attempts: 0 };
        }

        return { isLocked: false, remainingMs: 0, attempts: data.attempts };
    };

    const login = async (password: string): Promise<{ success: boolean; error?: string; lockoutEnd?: number; needs2FA?: boolean }> => {
        // Check lockout first
        const lockoutInfo = getLockoutInfo();
        if (lockoutInfo.isLocked) {
            return {
                success: false,
                error: 'Слишком много попыток. Подождите.',
                lockoutEnd: getLockoutData().lockoutEnd || undefined
            };
        }

        // Hash password on client BEFORE sending
        const inputHash = await hashPassword(password);

        // Verify on SERVER
        let isValid = false;

        if (isSupabaseConfigured && supabase) {
            isValid = await verifyPasswordOnServer(inputHash);
        } else {
            // LocalStorage fallback (less secure, for dev only)
            const storedSettings = localStorage.getItem('store_settings');
            if (storedSettings) {
                try {
                    const settings = JSON.parse(storedSettings);
                    if (settings.adminPasswordHash) {
                        isValid = inputHash === settings.adminPasswordHash;
                    } else if (settings.adminPassword) {
                        isValid = password === settings.adminPassword;
                    }
                } catch (e) { }
            }
        }

        if (isValid) {
            // Password correct - now send 2FA code
            const code = generateCode();
            const sent = await sendTelegramCode(code);

            if (!sent) {
                return {
                    success: false,
                    error: 'Не удалось отправить код в Telegram. Проверьте настройки бота.'
                };
            }

            // Store pending 2FA
            setPending2FAData({
                code: code,
                expiresAt: Date.now() + CODE_EXPIRY_MS
            });
            setPending2FA(true);

            return { success: false, needs2FA: true };
        }

        // Failed attempt
        const currentData = getLockoutData();
        const newAttempts = currentData.attempts + 1;

        await logLoginAttempt(false);

        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
            const lockoutEnd = Date.now() + LOCKOUT_DURATION_MS;
            saveLockoutData({ attempts: newAttempts, lockoutEnd });
            return {
                success: false,
                error: `Превышен лимит попыток. Блокировка на 15 минут.`,
                lockoutEnd
            };
        }

        saveLockoutData({ attempts: newAttempts, lockoutEnd: null });

        const remaining = MAX_LOGIN_ATTEMPTS - newAttempts;
        return {
            success: false,
            error: `Неверный пароль. Осталось попыток: ${remaining}`
        };
    };

    const verify2FA = async (code: string): Promise<{ success: boolean; error?: string }> => {
        if (!pending2FAData) {
            return { success: false, error: 'Сессия истекла. Начните заново.' };
        }

        // Check expiry
        if (Date.now() > pending2FAData.expiresAt) {
            setPending2FA(false);
            setPending2FAData(null);
            return { success: false, error: 'Код истёк. Попробуйте войти снова.' };
        }

        // Verify code
        if (code !== pending2FAData.code) {
            return { success: false, error: 'Неверный код.' };
        }

        // Success!
        saveLockoutData({ attempts: 0, lockoutEnd: null });
        await logLoginAttempt(true);

        setIsAuthenticated(true);
        setPending2FA(false);
        setPending2FAData(null);
        sessionStorage.setItem('admin_authenticated', 'true');

        return { success: true };
    };

    const logout = () => {
        setIsAuthenticated(false);
        setPending2FA(false);
        setPending2FAData(null);
        sessionStorage.removeItem('admin_authenticated');
    };

    return (
        <AdminContext.Provider value={{ isAuthenticated, isLoading, pending2FA, login, verify2FA, logout, getLockoutInfo }}>
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
