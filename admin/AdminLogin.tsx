import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { Lock, Eye, EyeOff, AlertCircle, Store } from 'lucide-react';

const AdminLogin: React.FC = () => {
    const { isAuthenticated, login } = useAdmin();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const success = await login(password);

        if (!success) {
            setError('Неверный пароль');
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
                        <Store className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Админ-панель</h1>
                    <p className="text-gray-400 mt-1">Skyress Store</p>
                </div>

                {/* Login Form */}
                <div className="bg-surface border border-border rounded-2xl p-8 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                </div>

                <p className="text-center text-gray-500 text-sm mt-6">
                    Забыли пароль? Обратитесь к администратору.
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
