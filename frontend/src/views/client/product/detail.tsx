import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Breadcrumb, Row, Col, Rate, Button, Tag, Divider, Spin, message, Carousel } from 'antd';
import { ShoppingCartOutlined, ThunderboltOutlined, SafetyCertificateOutlined, SyncOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getClientProductDetailAPI, getClientProductListAPI } from '@/apis/product';
import QuantityInput from '@/components/client/QuantityInput';
import { useCartStore } from '@/store/cartStore';
import type { ProductVariantResult } from '@/types/product';
import ProductCard from '@/components/client/ProductCard';

export default function ProductDetailClient() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);

  const { data: product, isLoading } = useQuery({
    queryKey: ['productDetail', slug],
    queryFn: () => getClientProductDetailAPI(slug || ''),
    enabled: !!slug,
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ['relatedProducts', product?.categoryId],
    queryFn: () => getClientProductListAPI({ pageNum: 1, pageSize: 4, categoryId: product?.categoryId }),
    enabled: !!product?.categoryId,
  });

  const [selectedVariant, setSelectedVariant] = useState<ProductVariantResult | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState<string>('');

  useEffect(() => {
    if (product) {
      setMainImage(product.thumbnailUrl);
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      }
    }
  }, [product]);

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '100px 0' }}><Spin size="large" /></div>;
  }

  if (!product) {
    return <div style={{ textAlign: 'center', padding: '100px 0' }}>Sản phẩm không tồn tại</div>;
  }

  const hasVariants = product.variants && product.variants.length > 0;
  
  // Lấy thông tin giá/tồn kho dựa vào biến thể đang chọn hoặc giá trị mặc định của sản phẩm
  const currentPrice = hasVariants ? selectedVariant?.salePrice || selectedVariant?.price || 0 : product.salePrice || product.price || 0;
  const originalPrice = hasVariants ? (selectedVariant?.salePrice ? selectedVariant?.price : undefined) : (product.salePrice ? product.price : undefined);
  const maxStock = hasVariants ? selectedVariant?.stockQuantity || 0 : product.stockQuantity || 0;
  
  const discountPercent = originalPrice && currentPrice < originalPrice 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) 
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAddToCart = () => {
    if (maxStock === 0) {
      message.error('Sản phẩm đã hết hàng!');
      return;
    }
    
    addToCart({
      productId: product.id,
      sku: hasVariants && selectedVariant ? selectedVariant.sku : product.productCode,
      name: product.name,
      title: hasVariants && selectedVariant ? selectedVariant.title : '',
      price: hasVariants && selectedVariant ? selectedVariant.price : product.price,
      salePrice: hasVariants && selectedVariant ? selectedVariant.salePrice : product.salePrice,
      quantity: quantity,
      thumbnailUrl: mainImage,
      maxStock: maxStock
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="client-container page-container">
      <Breadcrumb
        items={[
          { title: <Link to="/">Trang chủ</Link> },
          { title: <Link to={`/danh-muc/${product.categoryId}`}>{product.categoryName}</Link> },
          { title: product.name },
        ]}
        className="mb-24"
      />

      <div className="content-box">
        <Row gutter={48}>
          {/* Images Section */}
          <Col xs={24} md={10}>
            <div className="product-image-main">
              <img src={mainImage || 'https://via.placeholder.com/500'} alt={product.name} />
            </div>
            
            <div className="product-thumbnails">
              <div 
                onClick={() => setMainImage(product.thumbnailUrl)}
                className={`product-thumbnail-item ${mainImage === product.thumbnailUrl ? 'active' : ''}`}
              >
                <img src={product.thumbnailUrl || 'https://via.placeholder.com/80'} alt="thumbnail" />
              </div>
              {product.images?.map(img => (
                <div 
                  key={img.id}
                  onClick={() => setMainImage(img.imageUrl)}
                  className={`product-thumbnail-item ${mainImage === img.imageUrl ? 'active' : ''}`}
                >
                  <img src={img.imageUrl} alt="gallery" />
                </div>
              ))}
            </div>
          </Col>

          {/* Info Section */}
          <Col xs={24} md={14}>
            <h1 className="product-detail-title">{product.name}</h1>
            <div className="product-rating-row">
              {/* <div className="flex-center gap-8 text-accent">
                <Rate disabled defaultValue={4.8} style={{ fontSize: '14px', color: 'var(--accent-color)' }} />
                <span className="font-semibold">4.8</span>
              </div> */}
              {/* <Divider type="vertical" />
              <span>128 đánh giá</span>
              <Divider type="vertical" />
              <span>Đã bán 2.1k</span> */}
            </div>

            <div className="product-price-box">
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                <span className="product-price-main">
                  {formatPrice(currentPrice)}
                </span>
                {originalPrice && (
                  <>
                    <span className="product-price-original">
                      {formatPrice(originalPrice)}
                    </span>
                    {discountPercent > 0 && (
                      <Tag color="red" className="mb-8 font-semibold">-{discountPercent}%</Tag>
                    )}
                  </>
                )}
              </div>
              <div className="mt-16 text-secondary" style={{ fontSize: '13px' }}>Giá đã bao gồm VAT</div>
            </div>

            <div className="product-features">
              <div className="flex-center gap-8" style={{ alignItems: 'flex-start' }}>
                <ThunderboltOutlined className="text-primary mt-16" style={{ fontSize: '16px', marginTop: '2px' }} />
                <span><strong>Giao nhanh trong 30 phút</strong> áp dụng cho đơn từ 50k</span>
              </div>
              <div className="flex-center gap-8">
                <SafetyCertificateOutlined className="text-primary" style={{ fontSize: '16px' }} />
                <span>Cam kết chính hãng 100%</span>
              </div>
              <div className="flex-center gap-8">
                <SyncOutlined className="text-primary" style={{ fontSize: '16px' }} />
                <span>Đổi trả dễ dàng trong 7 ngày</span>
              </div>
            </div>

            {hasVariants && (
              <div className="mb-24">
                <div className="font-semibold mb-8">Phân loại:</div>
                <div className="flex-center gap-8" style={{ flexWrap: 'wrap' }}>
                  {product.variants.map((variant) => (
                    <Button 
                      key={variant.id}
                      type={selectedVariant?.id === variant.id ? 'primary' : 'default'}
                      onClick={() => setSelectedVariant(variant)}
                      style={selectedVariant?.id === variant.id ? { background: 'var(--primary-color)' } : {}}
                    >
                      {variant.title}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="product-quantity-row">
              <div className="font-semibold" style={{ width: '80px' }}>Số lượng:</div>
              <QuantityInput 
                value={quantity} 
                onChange={setQuantity} 
                max={maxStock} 
              />
              <span className="text-secondary" style={{ fontSize: '14px' }}>
                {maxStock > 0 ? `Còn ${maxStock} sản phẩm` : 'Hết hàng'}
              </span>
            </div>

            <div className="product-actions-row">
              <Button 
                size="large" 
                icon={<ShoppingCartOutlined />} 
                onClick={handleAddToCart}
                disabled={maxStock === 0}
                className="product-action-btn"
                style={{ 
                  borderColor: 'var(--primary-color)', 
                  color: 'var(--primary-color)'
                }}
              >
                Thêm vào giỏ hàng
              </Button>
              <Button 
                type="primary" 
                size="large" 
                onClick={handleBuyNow}
                disabled={maxStock === 0}
                className="product-action-btn"
                style={{ 
                  background: maxStock > 0 ? 'var(--primary-color)' : '#d9d9d9'
                }}
              >
                Mua ngay
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Description */}
      <div className="content-box">
        <h2 className="section-title">Mô tả sản phẩm</h2>
        <div style={{ fontSize: '14px', lineHeight: 1.8, color: '#333' }} dangerouslySetInnerHTML={{ __html: product.description || product.shortDescription }} />
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.content?.length > 0 && (
        <div className="content-box">
          <h2 className="section-title">Sản phẩm tương tự</h2>
          <Row gutter={[16, 16]}>
            {relatedProducts.content.slice(0, 4).map(item => (
              <Col xs={12} sm={12} md={6} key={item.id}>
                <ProductCard product={item} />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
}
