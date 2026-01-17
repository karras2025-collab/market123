import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../context/StoreDataContext';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Package,
    MoreVertical,
    Eye
} from 'lucide-react';

const Products: React.FC = () => {
    const { products, categories, deleteProduct, isLoading } = useStoreData();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getCategoryName = (categoryId: string) => {
        const cat = categories.find(c => c.id === categoryId);
        return cat?.name || 'Без категории';
    };

    const handleDelete = async (id: string) => {
        await deleteProduct(id);
        setDeleteConfirm(null);
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Товары</h1>
                    <p className="text-gray-400">Управление каталогом товаров ({products.length})</p>
                </div>
                <Link
                    to="/manage-zq84fk/products/new"
                    className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    Добавить товар
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Поиск товаров..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-surface border border-border rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-surface border border-border rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-w-[200px]"
                >
                    <option value="">Все категории</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {/* Products Table */}
            {filteredProducts.length === 0 ? (
                <div className="bg-surface border border-border rounded-2xl p-12 text-center">
                    <Package className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-xl font-bold text-white mb-2">Товары не найдены</h3>
                    <p className="text-gray-400 mb-6">
                        {searchQuery || selectedCategory
                            ? 'Попробуйте изменить фильтры поиска'
                            : 'Добавьте первый товар в каталог'}
                    </p>
                    <Link
                        to="/manage-zq84fk/products/new"
                        className="inline-flex items-center gap-2 bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Добавить товар
                    </Link>
                </div>
            ) : (
                <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Товар</th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Категория</th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Варианты</th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Теги</th>
                                <th className="text-right py-4 px-6 text-sm font-medium text-gray-400">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-14 h-14 rounded-xl bg-cover bg-center border border-border"
                                                style={{ backgroundImage: `url(${product.imageUrl})` }}
                                            />
                                            <div>
                                                <h3 className="font-medium text-white">{product.title}</h3>
                                                <p className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                                                    {product.description}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="px-3 py-1 rounded-lg bg-white/5 text-gray-300 text-sm">
                                            {getCategoryName(product.category)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-gray-400">{product.variants.length} вариантов</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex gap-1 flex-wrap">
                                            {product.tags.slice(0, 2).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {product.tags.length > 2 && (
                                                <span className="text-gray-500 text-xs">+{product.tags.length - 2}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/product/${product.id}`}
                                                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                                title="Просмотр"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </Link>
                                            <Link
                                                to={`/manage-zq84fk/products/${product.id}`}
                                                className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                                                title="Редактировать"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </Link>
                                            {deleteConfirm === product.id ? (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                                                    >
                                                        Удалить
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="px-3 py-1 rounded-lg bg-white/10 text-gray-300 text-sm font-medium hover:bg-white/20 transition-colors"
                                                    >
                                                        Отмена
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setDeleteConfirm(product.id)}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                    title="Удалить"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Products;
