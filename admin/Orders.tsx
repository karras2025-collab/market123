import React, { useState } from 'react';
import { useStoreData } from '../context/StoreDataContext';
import { Order } from '../types';
import {
    ShoppingBag,
    Mail,
    MessageCircle,
    Clock,
    CheckCircle,
    XCircle,
    Loader,
    ChevronDown,
    ChevronUp,
    Package
} from 'lucide-react';

const Orders: React.FC = () => {
    const { orders, updateOrderStatus, isLoading } = useStoreData();
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('');

    const filteredOrders = orders.filter(order =>
        !statusFilter || order.status === statusFilter
    );

    const statusOptions: { value: Order['status']; label: string; icon: React.ReactNode; color: string }[] = [
        { value: 'pending', label: 'Ожидает', icon: <Clock className="w-4 h-4" />, color: 'yellow' },
        { value: 'processing', label: 'В работе', icon: <Loader className="w-4 h-4" />, color: 'blue' },
        { value: 'completed', label: 'Завершён', icon: <CheckCircle className="w-4 h-4" />, color: 'green' },
        { value: 'cancelled', label: 'Отменён', icon: <XCircle className="w-4 h-4" />, color: 'red' },
    ];

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
        return statusOptions.find(s => s.value === status)?.label || status;
    };

    const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
        await updateOrderStatus(orderId, newStatus);
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
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Заказы</h1>
                    <p className="text-gray-400">Управление заказами ({orders.length})</p>
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-surface border border-border rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-w-[180px]"
                >
                    <option value="">Все статусы</option>
                    {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                </select>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="bg-surface border border-border rounded-2xl p-12 text-center">
                    <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-xl font-bold text-white mb-2">Заказов нет</h3>
                    <p className="text-gray-400">
                        {statusFilter
                            ? 'Нет заказов с выбранным статусом'
                            : 'Заказы появятся здесь после оформления через сайт'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-surface border border-border rounded-2xl overflow-hidden"
                        >
                            {/* Order Header */}
                            <div
                                className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <ShoppingBag className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-bold text-white">
                                                Заказ #{order.id.slice(-8)}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                                            {order.email && (
                                                <span className="flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {order.email}
                                                </span>
                                            )}
                                            {order.telegram && (
                                                <span className="flex items-center gap-1">
                                                    <MessageCircle className="w-3 h-3" />
                                                    {order.telegram}
                                                </span>
                                            )}
                                            <span>{order.items.length} товар(ов)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleString('ru-RU')}
                                    </span>
                                    {expandedOrder === order.id
                                        ? <ChevronUp className="w-5 h-5 text-gray-400" />
                                        : <ChevronDown className="w-5 h-5 text-gray-400" />
                                    }
                                </div>
                            </div>

                            {/* Order Details */}
                            {expandedOrder === order.id && (
                                <div className="border-t border-border p-6 bg-background/50">
                                    {/* Items */}
                                    <div className="mb-6">
                                        <h4 className="text-sm font-medium text-gray-400 mb-3">Товары</h4>
                                        <div className="space-y-2">
                                            {order.items.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border"
                                                >
                                                    <Package className="w-5 h-5 text-gray-500" />
                                                    <div>
                                                        <span className="text-white font-medium">{item.productTitle}</span>
                                                        <span className="text-gray-400 ml-2">— {item.variantName}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Status Change */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-400 mb-3">Изменить статус</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {statusOptions.map((status) => (
                                                <button
                                                    key={status.value}
                                                    onClick={() => handleStatusChange(order.id, status.value)}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${order.status === status.value
                                                            ? getStatusColor(status.value)
                                                            : 'border-border text-gray-400 hover:text-white hover:bg-white/5'
                                                        }`}
                                                >
                                                    {status.icon}
                                                    {status.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
