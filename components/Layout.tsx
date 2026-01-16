import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User, Globe, ShieldCheck, Mail, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStoreData } from '../context/StoreDataContext';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const { settings, isLoading } = useStoreData();
  const location = useLocation();

  const navLinks = [
    { name: 'Главная', path: '/' },
    { name: 'Каталог', path: '/catalog' },
    { name: 'Контакты', path: '#' },
    { name: 'FAQ', path: '#' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md px-4 py-3 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 transition hover:opacity-80">
              <img
                src="/logo.jpg"
                alt="Logo"
                className="size-10 rounded-lg object-cover shadow-lg shadow-primary/20"
              />
              <h2 className="text-xl font-bold leading-tight tracking-tight">{settings?.storeName || 'Skyress Store'}</h2>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition hover:text-primary ${location.pathname === link.path ? 'text-primary' : 'text-gray-300'}`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Desktop Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search Bar - Visual Only for Layout */}
            <div className="relative hidden lg:block w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Поиск..."
                className="h-10 w-full rounded-lg border border-border bg-surface pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            <div className="flex gap-3">
              <Link to="/cart" className="relative group flex size-10 items-center justify-center rounded-lg bg-surface transition hover:bg-white/10 hover:text-primary border border-border">
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {cart.length}
                  </span>
                )}
              </Link>
              <Link
                to="/admin"
                className="hidden sm:flex size-10 items-center justify-center rounded-lg bg-surface transition hover:bg-white/10 hover:text-primary border border-border"
                title="Админ-панель"
              >
                <Settings className="w-5 h-5" />
              </Link>
              <button
                className="md:hidden flex size-10 items-center justify-center rounded-lg bg-surface border border-border"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-surface border-b border-border p-4 flex flex-col gap-4 shadow-2xl">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-base font-medium text-gray-300 hover:text-primary py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/admin"
              className="text-base font-medium text-gray-300 hover:text-primary py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Админ-панель
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-[#0b0e14] px-4 lg:px-10 py-12 text-gray-400">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white">
                <img src="/logo.jpg" alt="Logo" className="size-8 rounded-lg object-cover" />
                <span className="text-lg font-bold">{settings?.storeName || 'Skyress Store'}</span>
              </div>
              <p className="text-sm leading-relaxed">
                Ваш #1 магазин премиум цифровых подписок. Безопасно, быстро и надёжно через Telegram.
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Каталог</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/catalog?category=ai" className="hover:text-primary">AI & Assistants</Link></li>
                <li><Link to="/catalog?category=devtools" className="hover:text-primary">Dev Tools</Link></li>
                <li><Link to="/catalog?category=gaming" className="hover:text-primary">Gaming</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Поддержка</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary">Помощь</a></li>
                <li><a href="#" className="hover:text-primary">Условия использования</a></li>
                <li><a href="#" className="hover:text-primary">Политика конфиденциальности</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Контакты</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  support@skyress.store
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-bold">TG</span>
                  @{settings?.telegramUsername || 'skyress_support'}
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8 text-center text-xs">
            <p>&copy; 2025 {settings?.storeName || 'Skyress Store'}. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;