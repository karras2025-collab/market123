import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { Lock, Eye, EyeOff, AlertCircle, Store, Clock, Shield, MessageCircle } from 'lucide-react';

const AdminLogin: React.FC = () => {
    const { isAuthenticated, login, verify2FA, pending2FA, getLockoutInfo } = useAdmin();
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [lockoutEnd, setLockoutEnd] = useState<number | null>(null);
    const [remainingTime, setRemainingTime] = useState('');

    // Check lockout status on mount and update timer
    useEffect(() => {
        const checkLockout = () => {
            const info = getLockoutInfo();
            if (info.isLocked && info.remainingMs > 0) {
                const endTime = Date.now() + info.remainingMs;
                setLockoutEnd(endTime);
            } else {
                setLockoutEnd(null);
            }
        };

        checkLockout();
        const interval = setInterval(checkLockout, 1000);
        return () => clearInterval(interval);
    }, [getLockoutInfo]);

    // Update countdown timer
    useEffect(() => {
        if (!lockoutEnd) {
            setRemainingTime('');
            return;
        }

        const updateTimer = () => {
            const now = Date.now();
            const remaining = lockoutEnd - now;

            if (remaining <= 0) {
                setLockoutEnd(null);
                setRemainingTime('');
                setError('');
                return;
            }

            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            setRemainingTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [lockoutEnd]);

    if (isAuthenticated) {
        return <Navigate to="/panel-x7k9" replace />;
    }

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login(password);

        if (!result.success && !result.needs2FA) {
            setError(result.error || 'Ошибка входа');
            if (result.lockoutEnd) {
                setLockoutEnd(result.lockoutEnd);
            }
        }

        setIsLoading(false);
        setPassword('');
    };

    const handleCodeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await verify2FA(code);

        if (!result.success) {
            setError(result.error || 'Ошибка проверки кода');
        }

        setIsLoading(false);
    };

    const isLocked = lockoutEnd !== null && lockoutEnd > Date.now();

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
                        <Store className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Админ-панель</h1>
                    <p className="text-gray-400 mt-1">Digi Deal</p>
                </div>

                {/* Login Form */}
                <div className="bg-surface border border-border rounded-2xl p-8 shadow-xl">
                    {isLocked ? (
                        /* Lockout Message */
                        <div className="text-center py-4">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-8 h-8 text-red-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Доступ заблокирован</h2>
                            <p className="text-gray-400 mb-4">Превышено количество попыток входа</p>
                            <div className="text-3xl font-mono font-bold text-red-400 mb-4">
                                {remainingTime}
                            </div>
                            <p className="text-sm text-gray-500">
                                Попробуйте снова через несколько минут
                            </p>
                        </div>
                    ) : pending2FA ? (
                        /* 2FA Code Entry */
                        <div>
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                                    <MessageCircle className="w-8 h-8 text-green-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">Проверка в Telegram</h2>
                                <p className="text-gray-400 text-sm">
                                    Код отправлен в Telegram.<br />Введите его ниже.
                                </p>
                            </div>

                            <form onSubmit={handleCodeSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        6-значный код
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            placeholder="000000"
                                            className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 text-white text-center text-2xl font-mono tracking-widest placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                            required
                                            disabled={isLoading}
                                            maxLength={6}
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading || code.length !== 6}
                                    className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Shield className="w-5 h-5" />
                                            Подтвердить
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-gray-500 text-xs">
                                    Код действителен 5 минут
                                </p>
                            </form>
                        </div>
                    ) : (
                        /* Password Entry */
                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Пароль
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Введите пароль"
                                        className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Войти'
                                )}
                            </button>
                        </form>
                    )}
                </div>

                <p className="text-center text-gray-500 text-sm mt-6">
                    🔐 Двухфакторная аутентификация
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
