import React, { useState } from 'react';
import { useStoreData } from '../context/StoreDataContext';
import { Banner } from '../types';
import { Trash2, Plus, Image, ExternalLink, MoveUp, MoveDown, Save, X } from 'lucide-react';

const Banners: React.FC = () => {
    const { banners, addBanner, updateBanner, deleteBanner, uploadImage } = useStoreData();
    const [isEditing, setIsEditing] = useState(false);
    const [currentBanner, setCurrentBanner] = useState<Partial<Banner> | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleEdit = (banner: Banner) => {
        setCurrentBanner(banner);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setCurrentBanner({
            title: '',
            description: '',
            imageUrl: '',
            linkUrl: '',
            buttonText: 'Подробнее',
            sortOrder: banners.length,
            active: true
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!currentBanner || !currentBanner.title || !currentBanner.imageUrl) {
            alert('Заполните заголовок и изображение');
            return;
        }

        try {
            if (currentBanner.id) {
                await updateBanner(currentBanner.id, currentBanner);
            } else {
                await addBanner(currentBanner as Omit<Banner, 'id'>);
            }
            setIsEditing(false);
            setCurrentBanner(null);
        } catch (e) {
            console.error(e);
            alert('Ошибка при сохранении');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await uploadImage(file);
            setCurrentBanner(prev => ({ ...prev, imageUrl: url }));
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Ошибка при загрузке');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Удалить этот баннер?')) {
            await deleteBanner(id);
        }
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Баннеры</h1>
                    <p className="text-gray-400">Управление слайдером на главной</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Добавить баннер
                </button>
            </div>

            {isEditing && currentBanner ? (
                <div className="bg-surface border border-border rounded-2xl p-6 mb-8 animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-xl font-bold text-white">
                            {currentBanner.id ? 'Редактировать баннер' : 'Новый баннер'}
                        </h2>
                        <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Заголовок</label>
                                <input
                                    type="text"
                                    value={currentBanner.title}
                                    onChange={e => setCurrentBanner({ ...currentBanner, title: e.target.value })}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Описание</label>
                                <textarea
                                    value={currentBanner.description}
                                    onChange={e => setCurrentBanner({ ...currentBanner, description: e.target.value })}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary h-24 resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Текст кнопки</label>
                                    <input
                                        type="text"
                                        value={currentBanner.buttonText}
                                        onChange={e => setCurrentBanner({ ...currentBanner, buttonText: e.target.value })}
                                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Ссылка</label>
                                    <input
                                        type="text"
                                        value={currentBanner.linkUrl}
                                        onChange={e => setCurrentBanner({ ...currentBanner, linkUrl: e.target.value })}
                                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                        placeholder="/catalog"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Background Image/Video Section */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Фоновое изображение или видео</label>
                                <p className="text-xs text-gray-500 mb-2">📐 Рекомендуемое разрешение: <span className="text-primary font-medium">1920×600 px</span> (или пропорционально). Поддерживаются: JPG, PNG, WebP, GIF, MP4, WebM</p>
                            </div>
                            <div className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center min-h-[150px] relative overflow-hidden">
                                {currentBanner.imageUrl ? (
                                    currentBanner.imageUrl.match(/\.(mp4|webm|mov)(?:\?.*)?$/i) ? (
                                        <video
                                            src={currentBanner.imageUrl}
                                            className="w-full h-full object-cover rounded-lg absolute inset-0 opacity-60"
                                            muted
                                            loop
                                            autoPlay
                                            playsInline
                                        />
                                    ) : (
                                        <img src={currentBanner.imageUrl} alt="Preview" className="w-full h-full object-cover rounded-lg absolute inset-0 opacity-50 hover:opacity-100 transition-opacity" />
                                    )
                                ) : (
                                    <div className="text-center text-gray-500">
                                        <Image className="w-10 h-10 mx-auto mb-2" />
                                        <span className="text-xs">1920×600 px рекомендуется</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*,video/mp4,video/webm"
                                    className="opacity-0 absolute inset-0 cursor-pointer z-20"
                                    onChange={handleImageUpload}
                                />
                                <div className="z-10 mt-2 pointer-events-none bg-black/50 px-3 py-1 rounded text-sm text-white">
                                    {isUploading ? 'Загрузка...' : 'Нажмите для загрузки'}
                                </div>
                            </div>
                            <input
                                type="text"
                                placeholder="Или ссылка на изображение/видео"
                                value={currentBanner.imageUrl}
                                onChange={e => setCurrentBanner({ ...currentBanner, imageUrl: e.target.value })}
                                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-white text-sm"
                            />

                            {/* Hero Image Section */}
                            <div className="mt-6">
                                <label className="block text-sm text-gray-400 mb-1">Hero изображение (отображается справа)</label>
                                <p className="text-xs text-gray-500 mb-2">📐 Рекомендуемое разрешение: <span className="text-primary font-medium">600×600 px</span>. Лучше использовать PNG с прозрачным фоном. Поддерживаются анимированные GIF.</p>
                            </div>
                            <div className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center min-h-[150px] relative bg-gradient-to-r from-transparent to-primary/10 overflow-hidden">
                                {currentBanner.heroImageUrl ? (
                                    currentBanner.heroImageUrl.match(/\.(mp4|webm|mov)(?:\?.*)?$/i) ? (
                                        <video
                                            src={currentBanner.heroImageUrl}
                                            className="max-h-[140px] object-contain relative z-0"
                                            muted
                                            loop
                                            autoPlay
                                            playsInline
                                        />
                                    ) : (
                                        <img src={currentBanner.heroImageUrl} alt="Hero Preview" className="max-h-[140px] object-contain relative z-0" />
                                    )
                                ) : (
                                    <div className="text-center text-gray-500">
                                        <Image className="w-10 h-10 mx-auto mb-2" />
                                        <span className="text-xs">600×600 px PNG рекомендуется</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*,video/mp4,video/webm"
                                    className="opacity-0 absolute inset-0 cursor-pointer z-20"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        setIsUploading(true);
                                        try {
                                            const url = await uploadImage(file);
                                            setCurrentBanner(prev => ({ ...prev, heroImageUrl: url }));
                                        } catch (error) {
                                            console.error('Upload failed:', error);
                                            alert('Ошибка при загрузке');
                                        } finally {
                                            setIsUploading(false);
                                        }
                                    }}
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Или ссылка на hero изображение/GIF"
                                value={currentBanner.heroImageUrl || ''}
                                onChange={e => setCurrentBanner({ ...currentBanner, heroImageUrl: e.target.value })}
                                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-white text-sm"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-400 hover:text-white">Отмена</button>
                        <button onClick={handleSave} className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-blue-600 transition-colors">Сохранить</button>
                    </div>
                </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4">
                {banners.map((banner, index) => (
                    <div key={banner.id} className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4 group">
                        <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-background">
                            <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-bold text-lg">{banner.title}</h3>
                            <p className="text-gray-400 text-sm truncate max-w-lg">{banner.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs ${banner.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {banner.active ? 'Активен' : 'Скрыт'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(banner)} className="p-2 hover:bg-white/10 rounded-lg text-blue-400">Редактировать</button>
                            <button onClick={() => handleDelete(banner.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}

                {banners.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        Нет активных баннеров. Добавьте первый!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Banners;
