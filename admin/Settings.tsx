import React, { useState } from 'react';
import { useStoreData } from '../context/StoreDataContext';
import {
    Save,
    Store,
    MessageCircle,
    Lock,
    Eye,
    EyeOff,
    Check,
    AlertCircle,
    Database
} from 'lucide-react';

const Settings: React.FC = () => {
    const { settings, updateSettings, isLoading, initializeDatabase } = useStoreData();

    const [formData, setFormData] = useState({
        storeName: settings?.storeName || '',
        telegramUsername: settings?.telegramUsername || '',
        bannerInterval: settings?.bannerInterval?.toString() || '3000'
    });

    React.useEffect(() => {
        if (settings) {
            setFormData({
                storeName: settings.storeName,
                telegramUsername: settings.telegramUsername,
                bannerInterval: (settings.bannerInterval || 3000).toString()
            });
        }
    }, [settings]);

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showPasswords, setShowPasswords] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveMessage(null);

        try {
            await updateSettings({
                storeName: formData.storeName,
                telegramUsername: formData.telegramUsername,
                bannerInterval: parseInt(formData.bannerInterval) || 3000
            });
            setSaveMessage({ type: 'success', text: 'Настройки сохранены!' });
        } catch (error) {
            setSaveMessage({ type: 'error', text: 'Ошибка сохранения' });
        }

        setIsSaving(false);
        setTimeout(() => setSaveMessage(null), 3000);
    };

    // SHA-256 hash function
    const hashPassword = async (password: string): Promise<string> => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage(null);

        // Verify current password by hashing and comparing
        const currentHash = await hashPassword(passwordForm.currentPassword);
        const storedHash = settings?.adminPasswordHash;
        const storedPlain = settings?.adminPassword;

        // Support both hashed and plain passwords for migration
        const isValidCurrent = storedHash
            ? currentHash === storedHash
            : passwordForm.currentPassword === storedPlain;

        if (!isValidCurrent) {
            setPasswordMessage({ type: 'error', text: 'Неверный текущий пароль' });
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'Минимум 6 символов' });
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Пароли не совпадают' });
            return;
        }

        setIsChangingPassword(true);

        try {
            // Hash the new password before saving
            const newPasswordHash = await hashPassword(passwordForm.newPassword);
            await updateSettings({
                adminPasswordHash: newPasswordHash,
                adminPassword: '' // Clear plain password
            });
            setPasswordMessage({ type: 'success', text: 'Пароль изменён! (хешированный)' });
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setPasswordMessage({ type: 'error', text: 'Ошибка изменения пароля' });
        }

        setIsChangingPassword(false);
        setTimeout(() => setPasswordMessage(null), 3000);
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-3xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Настройки</h1>
                <p className="text-gray-400">Управление настройками магазина</p>
            </div>

            {/* General Settings */}
            <div className="bg-surface border border-border rounded-2xl p-6 mb-8">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Store className="w-5 h-5 text-primary" />
                    Общие настройки
                </h2>

                <form onSubmit={handleSaveSettings} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Название магазина
                        </label>
                        <input
                            type="text"
                            value={formData.storeName}
                            onChange={(e) => setFormData(prev => ({ ...prev, storeName: e.target.value }))}
                            className="w-full bg-background border border-border rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Skyress Store"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Telegram для заказов
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <MessageCircle className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                value={formData.telegramUsername}
                                onChange={(e) => setFormData(prev => ({ ...prev, telegramUsername: e.target.value }))}
                                className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="rosaalba_prof"
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Без символа @. Клиенты будут переходить на t.me/{formData.telegramUsername}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Интервал смены баннеров (мс)
                        </label>
                        <input
                            type="number"
                            value={formData.bannerInterval}
                            onChange={(e) => setFormData(prev => ({ ...prev, bannerInterval: e.target.value }))}
                            className="w-full bg-background border border-border rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="3000"
                            min="1000"
                            step="100"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            Рекомендуемое значение: 3000-5000 мс
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all"
                        >
                            {isSaving ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Сохранить
                                </>
                            )}
                        </button>

                        {saveMessage && (
                            <div className={`flex items-center gap-2 text-sm ${saveMessage.type === 'success' ? 'text-green-400' : 'text-red-400'
                                }`}>
                                {saveMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                {saveMessage.text}
                            </div>
                        )}
                    </div>
                </form>
            </div>

            {/* Password Change */}
            <div className="bg-surface border border-border rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    Смена пароля
                </h2>

                <form onSubmit={handleChangePassword} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Текущий пароль
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords ? 'text' : 'password'}
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                className="w-full bg-background border border-border rounded-xl py-3 px-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords(!showPasswords)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white"
                            >
                                {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Новый пароль
                        </label>
                        <input
                            type={showPasswords ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                            className="w-full bg-background border border-border rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Подтверждение пароля
                        </label>
                        <input
                            type={showPasswords ? 'text' : 'password'}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="w-full bg-background border border-border rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={isChangingPassword}
                            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all"
                        >
                            {isChangingPassword ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Lock className="w-5 h-5" />
                                    Изменить пароль
                                </>
                            )}
                        </button>

                        {passwordMessage && (
                            <div className={`flex items-center gap-2 text-sm ${passwordMessage.type === 'success' ? 'text-green-400' : 'text-red-400'
                                }`}>
                                {passwordMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                {passwordMessage.text}
                            </div>
                        )}
                    </div>
                </form>
            </div>

            {/* Database Management */}
            <div className="bg-surface border border-border rounded-2xl p-6 lg:p-8 space-y-6 mt-8 border-t-2 border-t-primary/20">
                <div>
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <Database className="w-5 h-5 text-primary" />
                        База данных
                    </h2>
                    <p className="text-gray-400">Управление подключенной базой данных Supabase.</p>
                </div>

                <div className="max-w-xl">
                    <button
                        onClick={() => {
                            if (confirm('Это перезапишет все категории и товары базовыми значениями из каталога. Вы уверены?')) {
                                initializeDatabase();
                            }
                        }}
                        className="bg-surface border border-primary text-primary hover:bg-primary/10 px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
                    >
                        <Database className="w-4 h-4" />
                        Инициализировать / Сбросить БД
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                        Нажмите, если вы только что подключили Supabase и хотите загрузить в неё товары из каталога. Функция доступна только при активном подключении к БД.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
