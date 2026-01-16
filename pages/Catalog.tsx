import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useStoreData } from '../context/StoreDataContext';
import ProductCard from '../components/ProductCard';
import { Search, Filter, X } from 'lucide-react';

const CatalogPage: React.FC = () => {
  const location = useLocation();
  const { products, categories, isLoading } = useStoreData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Parse query params for initial category
  useEffect(() => {
    // Scroll to top on page load (fix for mobile)
    window.scrollTo(0, 0);

    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) setSelectedCategory(cat);
  }, [location.search]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-10 py-8">
      {/* Breadcrumbs */}
      <div className="flex gap-2 text-sm text-gray-400 mb-6">
        <span>Главная</span> / <span className="text-white">Каталог</span>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8 items-center justify-between">
        <h1 className="text-4xl font-bold text-white">Каталог</h1>

        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex flex-col gap-6 shrink-0">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Filter className="w-4 h-4" /> Фильтры
              </h3>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs text-primary hover:text-white"
                >
                  Сбросить
                </button>
              )}
            </div>

            <div className="space-y-1">
              <label className={`flex items-center gap-3 py-2 px-3 rounded-lg cursor-pointer transition-all ${!selectedCategory ? 'bg-primary/10 text-primary border border-primary/20' : 'hover:bg-surface text-gray-400'}`}>
                <input
                  type="radio"
                  name="category"
                  className="hidden"
                  checked={selectedCategory === null}
                  onChange={() => setSelectedCategory(null)}
                />
                <span className="text-sm font-medium">Все категории</span>
              </label>

              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg cursor-pointer transition-all ${selectedCategory === cat.id ? 'bg-primary/10 text-primary border border-primary/20' : 'hover:bg-surface text-gray-400'}`}
                >
                  <input
                    type="radio"
                    name="category"
                    className="hidden"
                    checked={selectedCategory === cat.id}
                    onChange={() => setSelectedCategory(cat.id)}
                  />
                  <span className="text-sm font-medium">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-2xl">
              <div className="text-gray-500 mb-2">Товары не найдены</div>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory(null) }}
                className="text-primary hover:underline"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;