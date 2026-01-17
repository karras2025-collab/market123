import React from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../context/StoreDataContext';
import {
    Package,
    FolderOpen,
    ShoppingBag,
    TrendingUp,
    Clock,
    ArrowRight,
    Plus
} from 'lucide-react';

const Dashboard: React.FC = () => {
    const { products, categories, orders, isLoading } = useStoreData();

    const stats = [
        {
            label: 'Товары',
            value: products.length,
            icon: Package,
            color: 'blue',
            link: '/manage-zq84fk/products'
        },
        {
            label: 'Категории',
            value: categories.length,
            icon: FolderOpen,
            color: 'purple',
            link: '/manage-zq84fk/categories'
        },
        {
            label: 'Заказы',
            value: orders.length,
            icon: ShoppingBag,
            color: 'green',
            link: '/manage-zq84fk/orders'
        },
        {
            label: 'Ожидают',
            value: orders.filter(o => o.status === 'pending').length,
            icon: Clock,
            color: 'orange',
            link: '/manage-zq84fk/orders'
        },
    ];

    const recentOrders = orders.slice(0, 5);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'Ожидает';
            case 'processing': return 'В работе';
            case 'completed': return 'Завершён';
            case 'cancelled': return 'Отменён';
            default: return status;
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-gray-400">Обзор магазина и последние заказы</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <Link
                        key={stat.label}
                        to={stat.link}
                        className="group bg-surface border border-border rounded-2xl p-6 hover:border-primary/30 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                                stat.color === 'purple' ? 'bg-purple-500/10 text-purple-400' :
                                    stat.color === 'green' ? 'bg-green-500/10 text-green-400' :
                                        'bg-orange-500/10 text-orange-400'
                                }`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-gray-400">{stat.label}</div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quick Actions */}
                <div className="bg-surface border border-border rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4">Быстрые действия</h2>
                    <div className="space-y-3">
                        <Link
                            to="/manage-zq84fk/products/new"
                            className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="font-medium">Добавить товар</span>
                        </Link>
                        <Link
                            to="/manage-zq84fk/categories"
                            className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-border text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                        >
                            <FolderOpen className="w-5 h-5" />
                            <span className="font-medium">Управление категориями</span>
                        </Link>
                        <Link
                            to="/manage-zq84fk/orders"
                            className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-border text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <span className="font-medium">Все заказы</span>
                        </Link>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white">Последние заказы</h2>
                        <Link to="/manage-zq84fk/orders" className="text-sm text-primary hover:text-blue-400 flex items-center gap-1">
                            Все заказы <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {recentOrders.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Заказов пока нет</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between p-4 rounded-xl bg-background border border-border"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                            <ShoppingBag className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">
                                                {order.items.length} товар(ов)
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {order.email || order.telegram || 'Без контакта'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
