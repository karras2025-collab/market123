import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order') || '';

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Success Icon */}
                <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-8 animate-pulse">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-black text-white mb-4">
                    Оплата прошла успешно!
                </h1>

                {/* Description */}
                <p className="text-gray-400 mb-6 leading-relaxed">
                    Спасибо за покупку! Ваш заказ принят в обработку.
                    Мы свяжемся с вами в ближайшее время для предоставления доступа.
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

                {/* Info Card */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-8 text-left">
                    <div className="flex items-start gap-3">
                        <Package className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                        <div className="text-sm text-blue-200">
                            <p className="font-medium mb-1">Что дальше?</p>
                            <ul className="text-blue-300/80 space-y-1">
                                <li>• Проверьте вашу почту для подтверждения</li>
                                <li>• Менеджер свяжется с вами в течение 24 часов</li>
                                <li>• Доступ будет предоставлен после проверки</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
                    >
                        На главную
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        to="/catalog"
                        className="inline-flex items-center justify-center gap-2 bg-surface hover:bg-surface/80 border border-border text-white font-medium py-3 px-6 rounded-xl transition-all"
                    >
                        Продолжить покупки
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
