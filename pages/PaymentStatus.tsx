import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const PaymentStatus: React.FC = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order') || '';
    const [status, setStatus] = useState<'checking' | 'success' | 'pending' | 'failed'>('checking');

    useEffect(() => {
        // Simulate status check - in production this would check the actual order status
        const timer = setTimeout(() => {
            // For now, show pending status
            setStatus('pending');
        }, 2000);

        return () => clearTimeout(timer);
    }, [orderId]);

    const statusConfig = {
        checking: {
            icon: <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />,
            title: 'Проверяем статус...',
            description: 'Пожалуйста, подождите, мы проверяем статус вашего платежа.',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/30',
        },
        success: {
            icon: <CheckCircle className="w-12 h-12 text-green-500" />,
            title: 'Оплата подтверждена!',
            description: 'Ваш платёж успешно обработан. Мы свяжемся с вами в ближайшее время.',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/30',
        },
        pending: {
            icon: <Clock className="w-12 h-12 text-yellow-500" />,
            title: 'Платёж обрабатывается',
            description: 'Ваш платёж находится в обработке. Это может занять несколько минут.',
            bgColor: 'bg-yellow-500/10',
            borderColor: 'border-yellow-500/30',
        },
        failed: {
            icon: <XCircle className="w-12 h-12 text-red-500" />,
            title: 'Платёж не прошёл',
            description: 'К сожалению, не удалось обработать ваш платёж.',
            bgColor: 'bg-red-500/10',
            borderColor: 'border-red-500/30',
        },
    };

    const config = statusConfig[status];

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Status Icon */}
                <div className={`w-24 h-24 rounded-full ${config.bgColor} border-2 ${config.borderColor} flex items-center justify-center mx-auto mb-8`}>
                    {config.icon}
                </div>

                {/* Title */}
                <h1 className="text-3xl font-black text-white mb-4">
                    {config.title}
                </h1>

                {/* Description */}
                <p className="text-gray-400 mb-6 leading-relaxed">
                    {config.description}
                </p>

                {/* Order ID */}
                {orderId && (
                    <div className="bg-surface border border-border rounded-xl p-4 mb-8">
                        <span className="text-gray-500 text-sm uppercase tracking-wider block mb-1">
                            Номер заказа
                        </span>
                        <div className="text-xl font-mono text-white font-bold">
                            {orderId.slice(-8).toUpperCase()}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
                    >
                        На главную
                    </Link>
                    {status === 'checking' && (
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center justify-center gap-2 bg-surface hover:bg-surface/80 border border-border text-white font-medium py-3 px-6 rounded-xl transition-all"
                        >
                            Обновить
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentStatus;
