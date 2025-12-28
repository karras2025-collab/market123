import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStoreData } from '../context/StoreDataContext';
import { useCart } from '../context/CartContext';
import { ShieldCheck, Info, CheckCircle, ShoppingCart } from 'lucide-react';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, isLoading } = useStoreData();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Товар не найден</h2>
        <Link to="/catalog" className="text-primary hover:underline">Вернуться в каталог</Link>
      </div>
    );
  }

  // Set default variant
  if (!selectedVariantId && product.variants.length > 0) {
    setSelectedVariantId(product.variants[0].id);
  }

  const handleAddToCart = () => {
    const variant = product.variants.find(v => v.id === selectedVariantId);
    if (!variant) return;

    const result = addToCart(product, variant);
    if (!result.success && result.error) {
      setErrorMsg(result.error);
    } else {
      setErrorMsg(null);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-10 py-8">
      {/* Breadcrumbs */}
      <div className="flex gap-2 text-sm text-gray-400 mb-8">
        <Link to="/catalog" className="hover:text-primary">Каталог</Link> / <span className="text-white">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Image */}
        <div className="lg:col-span-7">
          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-border bg-surface relative">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              {product.flow === 'telegram_redirect' ? (
                <span className="px-3 py-1 rounded-md bg-blue-500/90 text-white text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-md">
                  Telegram Checkout
                </span>
              ) : (
                <span className="px-3 py-1 rounded-md bg-purple-500/90 text-white text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-md">
                  Заявка на сайте
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border sticky top-24">
            <h1 className="text-3xl font-bold text-white mb-2">{product.title}</h1>
            <p className="text-gray-400 text-sm mb-6">{product.description}</p>

            {/* Variants */}
            <div className="mb-8">
              <label className="text-sm font-medium text-gray-300 block mb-3">Выберите вариант</label>
              <div className="grid grid-cols-1 gap-3">
                {product.variants.map((variant) => (
                  <label
                    key={variant.id}
                    className={`relative flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedVariantId === variant.id ? 'border-primary bg-primary/10' : 'border-border bg-background hover:border-gray-500'}`}
                  >
                    <input
                      type="radio"
                      name="variant"
                      className="hidden"
                      checked={selectedVariantId === variant.id}
                      onChange={() => setSelectedVariantId(variant.id)}
                    />
                    <span className="font-bold text-white">{variant.name}</span>
                    {variant.price && (
                      <span className="text-primary font-mono">{variant.price.toLocaleString('ru-RU')} ₽</span>
                    )}
                    {selectedVariantId === variant.id && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {errorMsg}
              </div>
            )}

            {/* Action */}
            <button
              onClick={handleAddToCart}
              className={`w-full font-bold text-lg py-4 px-6 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${addedToCart
                ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/20'
                : 'bg-primary hover:bg-blue-600 text-white shadow-primary/20'
                }`}
            >
              {addedToCart ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Добавлено!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  В корзину
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-border text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Гарантия
              </div>
              <div className="flex items-center gap-1">
                <Info className="w-4 h-4" /> {product.flow === 'telegram_redirect' ? 'Через Telegram' : 'Через форму'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Requirements Info */}
      <div className="mt-12 max-w-3xl">
        <h2 className="text-xl font-bold text-white mb-4">Требуемая информация</h2>
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            {Object.keys(product.requirements).filter(k => product.requirements[k as keyof typeof product.requirements]).length === 0 && <li>Дополнительные данные не требуются.</li>}
            {product.requirements.needsAccountEmail && <li>Нам понадобится email вашего аккаунта.</li>}
            {product.requirements.needsRegion && <li>Возможно потребуется указать регион.</li>}
            {product.requirements.needsInviteLink && <li>Будет предоставлена или потребуется ссылка-приглашение.</li>}
            {product.requirements.needsAdditionalComment && <li>Пожалуйста, опишите ваш запрос подробно.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;