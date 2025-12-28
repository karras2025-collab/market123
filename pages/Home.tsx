import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../context/StoreDataContext';
import { ArrowRight, ShieldCheck, Zap, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const { products, categories, banners, isLoading } = useStoreData();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play slider
  useEffect(() => {
    if (banners && banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % banners.filter(b => b.active).length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  // Filter active banners
  const activeBanners = banners ? banners.filter(b => b.active) : [];

  // Fallback banner if none exist
  const displayBanners = activeBanners.length > 0 ? activeBanners : [{
    id: 'default',
    title: 'Цифровое будущее',
    description: 'Магазин цифровых товаров и подписок. Мгновенный доступ к премиум-сервисам.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    linkUrl: '/catalog',
    buttonText: 'Перейти в каталог',
    sortOrder: 0,
    active: true
  }];

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % displayBanners.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + displayBanners.length) % displayBanners.length);

  // Group products by category for the showcase
  const productsByCategory = categories.map(cat => ({
    ...cat,
    items: products.filter(p => p.category === cat.id).slice(0, 4)
  })).filter(group => group.items.length > 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Slider */}
      <div className="relative h-[500px] lg:h-[600px] w-full overflow-hidden">
        {displayBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          >
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0">
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-20 h-full max-w-7xl mx-auto px-4 lg:px-10 flex flex-col justify-center">
              <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider mb-6">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  Skyress Store
                </div>
                <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
                  {banner.title}
                </h1>
                <p className="text-lg text-gray-200 mb-8 leading-relaxed max-w-xl drop-shadow-md">
                  {banner.description}
                </p>
                <Link
                  to={banner.linkUrl || '/catalog'}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-1"
                >
                  {banner.buttonText || 'Подробнее'}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        {displayBanners.length > 1 && (
          <div className="absolute bottom-8 right-8 z-30 flex gap-4 pr-4 lg:pr-10">
            <button onClick={prevSlide} className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/10">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextSlide} className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/10">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Slider Indicators */}
        {displayBanners.length > 1 && (
          <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-2">
            {displayBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all ${idx === currentSlide ? 'w-8 bg-primary' : 'w-4 bg-white/30 hover:bg-white/50'
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="py-12 border-b border-border bg-surface/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Мгновенная доставка</h3>
              <p className="text-sm text-gray-500">Товары приходят сразу после оплаты</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Лучшие сервисы</h3>
              <p className="text-sm text-gray-500">ChatGPT, Spotify, Midjourney и другие</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Гарантия качества</h3>
              <p className="text-sm text-gray-500">Полная поддержка на всех этапах</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-16 space-y-20">

        {/* Popular Categories */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Популярные категории</h2>
            <Link to="/catalog" className="text-primary hover:text-blue-400 transition-colors">
              Все категории
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/catalog?category=${category.id}`}
                className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-surface border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-full bg-background/50 border border-border group-hover:border-primary/50 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                  <span className="text-2xl font-bold uppercase">{category.name.charAt(0)}</span>
                </div>
                <span className="font-medium text-gray-300 group-hover:text-white transition-colors text-center">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products per Category */}
        {productsByCategory.map((category) => (
          <section key={category.id}>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h2 className="text-2xl font-bold text-white">{category.name}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.items.map((product) => (
                <Link
                  key={product.id}
                  to={`/catalog/${product.id}`}
                  className="group bg-surface rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 flex flex-col h-full"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {product.tags.includes('new') && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                        New
                      </span>
                    )}
                    {product.tags.includes('popular') && (
                      <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-purple-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                        Hit
                      </span>
                    )}

                    {/* Price Overlay on Hover - Optional Eye Candy */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      {product.variants.length > 0 && product.variants[0].price ? (
                        <span className="text-white font-bold">{product.variants[0].price} ₽</span>
                      ) : (
                        <span className="text-white text-sm">Подробнее</span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                      <div className="flex gap-2">
                        {product.variants.length > 0 ? (
                          <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-400">
                            От {product.variants[0].price ? `${product.variants[0].price} ₽` : '...'}
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-400">
                            Нет в наличии
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

      </div>
    </div>
  );
};

export default HomePage;