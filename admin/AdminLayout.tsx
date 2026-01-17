import React from 'react';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import {
    LayoutDashboard,
    Package,
    FolderOpen,
    ShoppingBag,
    Settings,
    LogOut,
    Store,
    ChevronRight,
    Image
} from 'lucide-react';

const AdminLayout: React.FC = () => {
    const { isAuthenticated, isLoading, logout } = useAdmin();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/panel-x7k9/login" replace />;
    }

    const navItems = [
        { path: '/panel-x7k9', icon: LayoutDashboard, label: 'Dashboard', exact: true },
        { path: '/panel-x7k9/products', icon: Package, label: 'Товары' },
        { path: '/panel-x7k9/categories', icon: FolderOpen, label: 'Категории' },
        { path: '/panel-x7k9/banners', icon: Image, label: 'Баннеры' },
        { path: '/panel-x7k9/orders', icon: ShoppingBag, label: 'Заказы' },
        { path: '/panel-x7k9/settings', icon: Settings, label: 'Настройки' },
    ];

    const isActive = (path: string, exact?: boolean) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="w-64 bg-surface border-r border-border flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-border">
                    <Link to="/panel-x7k9" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                            <Store className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-white">Admin Panel</h1>
                            <p className="text-xs text-gray-500">Skyress Store</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const active = isActive(item.path, item.exact);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
                                    ? 'bg-primary/10 text-primary border border-primary/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                                {active && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-border space-y-2">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <Store className="w-5 h-5" />
                        <span className="font-medium">Магазин</span>
                    </Link>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Выйти</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
