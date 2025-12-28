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
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                      {banner.title}
                    </h1>
                    <p className="text-lg text-gray-300 mb-8 leading-relaxed">
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
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'w-8 bg-primary' : 'bg-white/30 hover:bg-white/50'
                      }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="py-12 border-b border-border bg-surface/30 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 lg:px-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Мгновенная доставка</h3>
                  <p className="text-sm text-gray-500">Товары приходят сразу после оплаты</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Лучшие сервисы</h3>
                  <p className="text-sm text-gray-500">ChatGPT, Spotify, Midjourney и другие</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Гарантия качества</h3>
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
                    <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:scale-110 transition-all">
                      <div className={`icon-${category.icon} w-6 h-6`} />
                      {/* Note: Icon rendering might need a helper if icons are strings */}
                    </div>
                    <span className="font-medium text-gray-300 group-hover:text-white transition-colors">
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
                            {product.variants.slice(0, 2).map(v => (
                              <span key={v.id} className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-400">
                                {v.name}
                              </span>
                            ))}
                            {product.variants.length > 2 && (
                              <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-400">
                                +{product.variants.length - 2}
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