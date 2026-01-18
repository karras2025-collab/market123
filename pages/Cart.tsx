import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useStoreData } from '../context/StoreDataContext';
import { Trash2, ArrowRight, Mail, MessageCircle, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, currentFlow, clearCart } = useCart();
  const { settings, addOrder } = useStoreData();
  const [isSuccess, setIsSuccess] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for Site Request
  const [email, setEmail] = useState('');
  const [comments, setComments] = useState('');

  if (cart.length === 0 && !isSuccess) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-surface border border-border flex items-center justify-center mb-6">
          <Trash2 className="w-8 h-8 text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Корзина пуста</h2>
        <p className="text-gray-400 mb-8">Вы ещё не добавили ни одного товара.</p>
        <Link to="/catalog" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors">
          Открыть каталог
        </Link>
      </div>
    );
  }

  // --- Logic for Success/Submission ---

  const handleSiteRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save order to database
    const orderId = await addOrder({
      email: email,
      telegram: null,
      items: cart.map(item => ({
        productId: item.product.id,
        productTitle: item.product.title,
        variantId: item.selectedVariant.id,
        variantName: item.selectedVariant.name,
      })),
      status: 'pending',
    });

    setRequestId(orderId.slice(-8).toUpperCase());
    setIsSuccess(true);
    clearCart();
    setIsSubmitting(false);
  };

  const telegramMessage = `Здравствуйте! Хочу заказать:\n\n${cart.map(item => `- ${item.product.title} (${item.selectedVariant.name})`).join('\n')}\n\nВсего товаров: ${cart.length}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(telegramMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const telegramLink = `https://t.me/${settings?.telegramUsername || 'RosaAlba_Prof'}`;

  // --- Success View ---
  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Заявка получена!</h2>
        <p className="text-gray-400 mb-6">Мы получили вашу заявку. Менеджер свяжется с вами по email.</p>
        <div className="bg-surface border border-border rounded-xl p-4 mb-8 inline-block">
          <span className="text-gray-500 text-sm uppercase tracking-wider">ID заявки</span>
          <div className="text-2xl font-mono text-white font-bold">REQ-{requestId}</div>
        </div>
        <div>
          <Link to="/" className="text-primary hover:underline">На главную</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-10 py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-black leading-tight mb-2 text-white">Корзина</h1>
        <p className="text-gray-400">Проверьте выбранные товары перед оформлением.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* Left: Cart Items */}
        <div className="flex-1 flex flex-col gap-4">
          {cart.map((item, index) => (
            <div key={index} className="group relative flex items-center gap-4 bg-surface border border-border p-4 rounded-xl transition-all hover:border-primary/50">
              <div className="shrink-0">
                <div
                  className="size-16 lg:size-20 rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.product.imageUrl})` }}
                ></div>
              </div>
              <div className="flex flex-col justify-center flex-1 min-w-0">
                <h3 className="text-base lg:text-lg font-bold text-white leading-normal truncate pr-8">
                  {item.product.title}
                </h3>
                <p className="text-gray-400 text-sm font-normal leading-normal">
                  {item.selectedVariant.name}
                </p>
                {/* Visual tag for flow type */}
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-600 mt-1">
                  {item.product.flow === 'site_request' ? 'Заявка на сайте' : 'Через Telegram'}
                </span>
              </div>
              <button
                onClick={() => removeFromCart(index)}
                aria-label="Remove item"
                className="shrink-0 size-10 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Right: Checkout Logic */}
        <div className="w-full lg:w-[420px] shrink-0">
          <div className="sticky top-24 flex flex-col gap-6">
            <div className="bg-surface border border-border rounded-2xl p-6 lg:p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6 text-white">Оформление заказа</h3>

              {currentFlow === 'site_request' ? (
                // --- SITE REQUEST FORM ---
                <form onSubmit={handleSiteRequestSubmit}>
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">Контактный Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        required
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="comments">Дополнительно</label>
                    <textarea
                      id="comments"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Особые пожелания?"
                      rows={4}
                      className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-base py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(19,91,236,0.3)] hover:shadow-[0_0_30px_rgba(19,91,236,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Отправить заявку</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                // --- TELEGRAM FLOW ---
                <div className="flex flex-col gap-4">
                  <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl">
                    <p className="text-sm text-blue-200 mb-2">Шаг 1: Скопируйте информацию о заказе.</p>
                    <button
                      onClick={copyToClipboard}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 py-2 rounded-lg text-blue-300 font-medium transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Скопировано!" : "Скопировать заказ"}
                    </button>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl">
                    <p className="text-sm text-blue-200 mb-2">Шаг 2: Отправьте менеджеру.</p>
                    <a
                      href={telegramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Открыть Telegram
                    </a>
                  </div>

                  <p className="text-xs text-gray-500 text-center mt-2">
                    Нажмите "Открыть Telegram" для перехода к @{settings?.telegramUsername || 'RosaAlba_Prof'}. Вставьте скопированное сообщение.
                  </p>
                </div>
              )}

              <p className="text-center text-xs text-gray-600 mt-4 pt-4 border-t border-border">
                Безопасный процесс. Оплата не требуется на этом этапе.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;