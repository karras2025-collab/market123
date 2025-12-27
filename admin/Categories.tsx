import React, { useState } from 'react';
import { useStoreData } from '../context/StoreDataContext';
import {
    Plus,
    Edit2,
    Trash2,
    FolderOpen,
    Check,
    X
} from 'lucide-react';

const Categories: React.FC = () => {
    const { categories, addCategory, updateCategory, deleteCategory, isLoading } = useStoreData();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editIcon, setEditIcon] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [newIcon, setNewIcon] = useState('folder');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const iconOptions = [
        'folder', 'brain', 'code', 'palette', 'gamepad', 'briefcase',
        'credit-card', 'music', 'video', 'book', 'star', 'heart', 'zap'
    ];

    const startEdit = (id: string, name: string, icon: string) => {
        setEditingId(id);
        setEditName(name);
        setEditIcon(icon);
    };

    const saveEdit = async () => {
        if (editingId && editName.trim()) {
            await updateCategory(editingId, { name: editName, icon: editIcon });
            setEditingId(null);
        }
    };

    const handleAdd = async () => {
        if (newName.trim()) {
            await addCategory({ name: newName, icon: newIcon });
            setNewName('');
            setNewIcon('folder');
            setIsAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        await deleteCategory(id);
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
                    <h1 className="text-3xl font-bold text-white mb-2">Категории</h1>
                    <p className="text-gray-400">Управление категориями товаров ({categories.length})</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    Добавить категорию
                </button>
            </div>

            {/* Add Form */}
            {isAdding && (
                <div className="bg-surface border border-primary/30 rounded-2xl p-6 mb-6">
                    <h3 className="font-bold text-white mb-4">Новая категория</h3>
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="flex-1 bg-background border border-border rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Название категории"
                            autoFocus
                        />
                        <select
                            value={newIcon}
                            onChange={(e) => setNewIcon(e.target.value)}
                            className="bg-background border border-border rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-w-[150px]"
                        >
                            {iconOptions.map((icon) => (
                                <option key={icon} value={icon}>{icon}</option>
                            ))}
                        </select>
                        <div className="flex gap-2">
                            <button
                                onClick={handleAdd}
                                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
                            >
                                <Check className="w-5 h-5" />
                                Добавить
                            </button>
                            <button
                                onClick={() => { setIsAdding(false); setNewName(''); }}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl transition-all"
                            >
                                <X className="w-5 h-5" />
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Categories List */}
            {categories.length === 0 ? (
                <div className="bg-surface border border-border rounded-2xl p-12 text-center">
                    <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-xl font-bold text-white mb-2">Нет категорий</h3>
                    <p className="text-gray-400 mb-6">Добавьте первую категорию для товаров</p>
                </div>
            ) : (
                <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                    <div className="divide-y divide-border">
                        {categories.map((category) => (
                            <div key={category.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                                {editingId === category.id ? (
                                    <div className="flex-1 flex items-center gap-4">
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="flex-1 bg-background border border-border rounded-xl py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            autoFocus
                                        />
                                        <select
                                            value={editIcon}
                                            onChange={(e) => setEditIcon(e.target.value)}
                                            className="bg-background border border-border rounded-xl py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        >
                                            {iconOptions.map((icon) => (
                                                <option key={icon} value={icon}>{icon}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={saveEdit}
                                            className="p-2 rounded-lg text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-colors"
                                        >
                                            <Check className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                                {category.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-white">{category.name}</h3>
                                                <p className="text-sm text-gray-500">Иконка: {category.icon}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => startEdit(category.id, category.name, category.icon)}
                                                className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            {deleteConfirm === category.id ? (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleDelete(category.id)}
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
                                                    onClick={() => setDeleteConfirm(category.id)}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
