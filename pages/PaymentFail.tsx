import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { XCircle, RefreshCw, MessageCircle, ArrowLeft } from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';

const PaymentFail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order') || '';
    const { settings } = useStoreData();

    const telegramLink = `https://t.me/${settings?.telegramUsername || 'RosaAlba_Prof'}`;

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Error Icon */}
                <div className="w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center mx-auto mb-8">
                    <XCircle className="w-12 h-12 text-red-500" />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-black text-white mb-4">
                    Оплата не прошла
                </h1>

                {/* Description */}
                <p className="text-gray-400 mb-6 leading-relaxed">
                    К сожалению, платёж не был завершён. Это могло произойти из-за
                    недостатка средств, отмены операции или технической ошибки.
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

                {/* Help Card */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-8 text-left">
                    <div className="text-sm text-yellow-200">
                        <p className="font-medium mb-2">Возможные причины:</p>
                        <ul className="text-yellow-300/80 space-y-1">
                            <li>• Недостаточно средств на счёте</li>
                            <li>• Операция была отменена</li>
                            <li>• Банк отклонил транзакцию</li>
                            <li>• Истекло время ожидания</li>
                        </ul>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <Link
                        to="/cart"
                        className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Попробовать снова
                    </Link>

                    <a
                        href={telegramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-300 font-medium py-3 px-6 rounded-xl transition-all"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Связаться с поддержкой
                    </a>

                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 text-gray-400 hover:text-white font-medium py-3 px-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Вернуться на главную
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentFail;
