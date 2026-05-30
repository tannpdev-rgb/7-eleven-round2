import React from 'react';
import { StarFilled, PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import type { ProductItem } from '@/types/product';

type ProductCardProps = {
  product: ProductItem & { price?: number; salePrice?: number; rating?: number; reviews?: number; discount?: number };
};

export default function ProductCard({ product }: ProductCardProps) {
  const currentPrice = product.salePrice || product.price || 0;
  const originalPrice = product.salePrice ? product.price : undefined;
  
  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to detail page
    // TODO: Add to cart store logic here
    console.log('Add to cart', product.id);
  };

  return (
    <Link to={`/product/${product.slug}`} className="product-card">
      {product.discount && (
        <div className="product-card-badge">-{product.discount}%</div>
      )}
      <div className="product-card-img-wrapper">
        <img 
          src={product.thumbnailUrl || 'https://via.placeholder.com/200'} 
          alt={product.name} 
          className="product-card-img"
          loading="lazy"
        />
      </div>
      <div className="product-card-title">{product.name}</div>
      {/* <div className="product-card-rating">
        <StarFilled className="product-card-star" />
        <span>{product.rating || '4.8'}</span>
        {product.reviews && <span>({product.reviews} đánh giá)</span>}
      </div> */}
      <div className="product-card-bottom">
        <div className="product-card-price-wrapper">
          <span className="product-card-price">{formatPrice(currentPrice)}</span>
          {originalPrice && (
            <span className="product-card-price-original">{formatPrice(originalPrice)}</span>
          )}
        </div>
        <button 
          className="product-card-add-btn" 
          onClick={handleAddToCart}
          aria-label="Thêm vào giỏ hàng"
        >
          <PlusOutlined />
        </button>
      </div>
    </Link>
  );
}
