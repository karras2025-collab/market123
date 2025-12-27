import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-surface overflow-hidden transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-black/50">
      <div className="relative mb-4 aspect-video w-full overflow-hidden bg-background">
        <img 
          src={product.imageUrl} 
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
        />
        {product.tags.includes('popular') && (
          <div className="absolute top-2 right-2 rounded bg-primary/90 px-2 py-1 text-xs font-bold text-white shadow-lg">
            BESTSELLER
          </div>
        )}
        {product.tags.includes('new') && (
          <div className="absolute top-2 left-2 rounded bg-green-500/90 px-2 py-1 text-xs font-bold text-white shadow-lg">
            NEW
          </div>
        )}
      </div>
      
      <div className="flex flex-1 flex-col p-4 pt-0">
        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        <p className="mb-4 text-sm text-gray-400 line-clamp-2 mt-1">
          {product.description}
        </p>
        
        <div className="mt-auto">
          <Link 
            to={`/product/${product.id}`}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-white transition hover:bg-primary/90 active:scale-[0.98]"
          >
            <ShoppingCart className="w-4 h-4" />
            View Options
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;