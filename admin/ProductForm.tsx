import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStoreData } from '../context/StoreDataContext';
import { Product, Variant, CheckoutFlow } from '../types';
import {
    ArrowLeft,
    Save,
    Plus,
    Trash2,
    Image,
    X
} from 'lucide-react';

const ProductForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { products, categories, addProduct, updateProduct, uploadImage, isLoading } = useStoreData();

    const isEdit = Boolean(id);
    const existingProduct = id ? products.find(p => p.id === id) : null;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        service: '',
        tags: [] as string[],
        flow: 'telegram_redirect' as CheckoutFlow,
        imageUrl: '',
        variants: [{ id: 'var-1', name: '', price: 0 }] as Variant[],
        requirements: {
            needsAccountEmail: false,
            needsRegion: false,
            needsPlanTerm: false,
            needsInviteLink: false,
            needsAdditionalComment: false,
        },
    });

    const [tagInput, setTagInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (existingProduct) {
            setFormData({
                title: existingProduct.title,
                description: existingProduct.description,
                category: existingProduct.category,
                service: existingProduct.service,
                tags: existingProduct.tags,
                flow: existingProduct.flow,
                imageUrl: existingProduct.imageUrl,
                variants: existingProduct.variants.length > 0
                    ? existingProduct.variants
                    : [{ id: 'var-1', name: '', price: 0 }],
                requirements: existingProduct.requirements,
            });
        }
    }, [existingProduct]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const productData = {
                ...formData,
                variants: formData.variants.filter(v => v.name.trim() !== ''),
            };

            if (isEdit && id) {
                await updateProduct(id, productData);
            } else {
                await addProduct(productData);
            }
            navigate('/manage-zq84fk/products');
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Ошибка при сохранении товара');
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await uploadImage(file);
            setFormData(prev => ({ ...prev, imageUrl: url }));
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Ошибка при загрузке изображения');
        } finally {
            setIsUploading(false);
        }
    };

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, { id: `var-${Date.now()}`, name: '', price: 0 }],
        }));
    };

    const removeVariant = (index: number) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index),
        }));
    };

    const updateVariant = (index: number, field: keyof Variant, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map((v, i) =>
                i === index ? { ...v, [field]: value } : v
            ),
        }));
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()],
            }));
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tag),
        }));
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/manage-zq84fk/products')}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        {isEdit ? 'Редактирование товара' : 'Новый товар'}
                    </h1>
                    <p className="text-gray-400">
                        {isEdit ? 'Измените данные товара' : 'Заполните информацию о товаре'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="bg-surface border border-border rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-6">Основная информация</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Название товара *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Например: ChatGPT Plus"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Описание *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={4}
                                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                placeholder="Подробное описание товара..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Категория
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="">Выберите категорию</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Сервис
                            </label>
                            <input
                                type="text"
                                value={formData.service}
                                onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
                                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="chatgpt, spotify, etc."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Тип оформления
                            </label>
                            <select
                                value={formData.flow}
                                onChange={(e) => setFormData(prev => ({ ...prev, flow: e.target.value as CheckoutFlow }))}
                                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="telegram_redirect">Telegram (редирект)</option>
                                <option value="site_request">Заявка на сайте</option>
                            </select>
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            <label className="block text-sm font-medium text-gray-300">
                                Изображение товара
                            </label>

                            <div className="flex flex-col md:flex-row gap-4">
                                {/* File Upload */}
                                <div className="flex-1">
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="image-upload"
                                            disabled={isUploading}
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className={`flex items-center justify-center gap-3 w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${isUploading
                                                ? 'bg-white/5 border-gray-600 opacity-50'
                                                : 'bg-white/5 border-border hover:border-primary/50 hover:bg-white/10'
                                                }`}
                                        >
                                            {isUploading ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                    <span className="text-sm text-gray-400">Загрузка...</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Image className="w-8 h-8 text-gray-500 group-hover:text-primary transition-colors" />
                                                    <span className="text-sm text-gray-400 group-hover:text-gray-300">Нажмите для загрузки файла</span>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* URL Input fallback */}
                                <div className="flex-1">
                                    <div className="h-full flex flex-col justify-end">
                                        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                                            Или вставьте URL ссылки
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                            className="w-full bg-background border border-border rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Image Preview */}
                            {formData.imageUrl && (
                                <div className="relative inline-block mt-4">
                                    <img
                                        src={formData.imageUrl}
                                        alt="Предпросмотр"
                                        className="w-32 h-32 rounded-xl object-cover border border-border shadow-2xl"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Variants */}
                <div className="bg-surface border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white">Варианты</h2>
                        <button
                            type="button"
                            onClick={addVariant}
                            className="flex items-center gap-2 text-primary hover:text-blue-400 text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Добавить вариант
                        </button>
                    </div>

                    <div className="space-y-3">
                        {formData.variants.map((variant, index) => (
                            <div key={variant.id} className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={variant.name}
                                    onChange={(e) => updateVariant(index, 'name', e.target.value)}
                                    className="flex-[2] bg-background border border-border rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Название (напр. 1 месяц)"
                                />
                                <input
                                    type="number"
                                    value={variant.price || ''}
                                    onChange={(e) => updateVariant(index, 'price', Number(e.target.value))}
                                    className="flex-1 bg-background border border-border rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Цена (₽)"
                                />
                                {formData.variants.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeVariant(index)}
                                        className="p-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tags */}
                <div className="bg-surface border border-border rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-6">Теги</h2>

                    <div className="flex items-center gap-3 mb-4">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            className="flex-1 bg-background border border-border rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Введите тег..."
                        />
                        <button
                            type="button"
                            onClick={addTag}
                            className="px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                        >
                            Добавить
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                            <span
                                key={tag}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="p-0.5 hover:bg-primary/20 rounded"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                        {formData.tags.length === 0 && (
                            <span className="text-gray-500 text-sm">Нет тегов</span>
                        )}
                    </div>
                </div>

                {/* Requirements */}
                <div className="bg-surface border border-border rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-6">Требования к заказу</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { key: 'needsAccountEmail', label: 'Email аккаунта' },
                            { key: 'needsRegion', label: 'Регион' },
                            { key: 'needsPlanTerm', label: 'Срок плана' },
                            { key: 'needsInviteLink', label: 'Ссылка приглашения' },
                            { key: 'needsAdditionalComment', label: 'Дополнительный комментарий' },
                        ].map((req) => (
                            <label key={req.key} className="flex items-center gap-3 p-4 rounded-xl bg-background border border-border cursor-pointer hover:border-primary/30 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={formData.requirements[req.key as keyof typeof formData.requirements] || false}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        requirements: { ...prev.requirements, [req.key]: e.target.checked },
                                    }))}
                                    className="w-5 h-5 rounded border-gray-600 bg-background text-primary focus:ring-primary focus:ring-offset-0"
                                />
                                <span className="text-gray-300">{req.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/manage-zq84fk/products')}
                        className="px-6 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors font-medium"
                    >
                        Отмена
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-primary/20"
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                {isEdit ? 'Сохранить' : 'Создать товар'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
