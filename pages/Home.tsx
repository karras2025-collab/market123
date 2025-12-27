import React from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../context/StoreDataContext';
import ProductCard from '../components/ProductCard';
import { ArrowRight, ShieldCheck, Zap, CreditCard, ChevronRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const { products, categories, isLoading } = useStoreData();
  const popularProducts = products.filter(p => p.tags.includes('popular')).slice(0, 4);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative px-4 py-8 lg:px-10 lg:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-2xl bg-[#13161c] border border-border shadow-2xl shadow-black/50">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent z-10"></div>
            <div
              className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80')" }}
            ></div>

            <div className="relative z-20 flex flex-col items-start gap-6 p-8 lg:p-16 lg:w-2/3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
                <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                Skyress Store
              </div>
              <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl tracking-tight">
                Premium подписки на <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                  международные сервисы
                </span>
              </h1>
              <p className="text-lg text-gray-400 max-w-xl font-medium">
                ChatGPT, Gemini, Spotify, Netflix и многое другое. Простое оформление через Telegram. Без сложных платежей.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/catalog" className="flex h-12 items-center gap-2 rounded-lg bg-primary px-8 text-sm font-bold text-white transition hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(19,91,236,0.4)]">
                  Открыть каталог
                </Link>
                <a href="#how-it-works" className="flex h-12 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-8 text-sm font-bold text-white transition hover:bg-white/10 backdrop-blur-sm">
                  Как это работает
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Metrics */}
      <section className="px-4 py-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-6 transition hover:border-primary/20 hover:bg-[#1c2230]">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Быстро</p>
                <p className="text-sm text-gray-400">Обработка в течение дня</p>
              </div>
            </div>
            <div className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-6 transition hover:border-primary/20 hover:bg-[#1c2230]">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Гарантия</p>
                <p className="text-sm text-gray-400">Полная гарантия на срок</p>
              </div>
            </div>
            <div className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-6 transition hover:border-primary/20 hover:bg-[#1c2230]">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Удобно</p>
                <p className="text-sm text-gray-400">Без иностранных карт</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-12 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white tracking-tight">Категории</h2>
            <Link to="/catalog" className="text-sm font-semibold text-primary hover:text-blue-400 flex items-center gap-1">
              Все <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalog?category=${cat.id}`}
                className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-6 transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-background border border-border group-hover:border-primary/50 group-hover:bg-primary/20 transition-all">
                  <div className="text-gray-400 group-hover:text-primary text-2xl font-bold">
                    {cat.name.charAt(0)}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white text-center">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="bg-surface/30 border-y border-border px-4 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Популярные товары</h2>
            <p className="mt-2 text-gray-400">Самые востребованные подписки этой недели</p>
          </div>
          {popularProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Добавьте товары с тегом "popular" чтобы они появились здесь</p>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-4 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-white">Как это работает</h2>
          <div className="relative flex flex-col justify-between gap-8 md:flex-row">
            <div className="absolute left-0 top-8 hidden h-0.5 w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent md:block"></div>

            {[
              { title: 'Выберите сервис', desc: 'Найдите нужную подписку в каталоге.', icon: '1' },
              { title: 'Напишите в Telegram', desc: 'Добавьте в корзину и оформите заказ.', icon: '2' },
              { title: 'Получите доступ', desc: 'Получите данные для входа.', icon: '3' }
            ].map((step, idx) => (
              <div key={idx} className="relative flex flex-1 flex-col items-center text-center">
                <div className="relative z-10 mb-6 flex size-16 items-center justify-center rounded-2xl border-2 border-primary/50 bg-background text-primary shadow-[0_0_15px_rgba(19,91,236,0.3)] font-bold text-xl">
                  {step.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{step.title}</h3>
                <p className="max-w-xs text-sm text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;