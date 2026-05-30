import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Breadcrumb, Row, Col, Checkbox, Button, Input, Divider, Empty } from 'antd';
import { DeleteOutlined, ShopOutlined } from '@ant-design/icons';
import { useCartStore } from '@/store/cartStore';
import QuantityInput from '@/components/client/QuantityInput';

export default function CartClient() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity } = useCartStore();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleSelectAll = (e: any) => {
    if (e.target.checked) {
      setSelectedItems(items.map(i => i.sku));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (sku: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, sku]);
    } else {
      setSelectedItems(selectedItems.filter(id => id !== sku));
    }
  };

  const handleRemoveSelected = () => {
    selectedItems.forEach(sku => removeFromCart(sku));
    setSelectedItems([]);
  };

  // Tính tổng tiền các item ĐƯỢC CHỌN
  const selectedTotal = items
    .filter(item => selectedItems.includes(item.sku))
    .reduce((total, item) => total + ((item.salePrice || item.price) * item.quantity), 0);

  const freeShippingThreshold = 200000;

  if (items.length === 0) {
    return (
      <div className="client-container page-container text-center">
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<span style={{ fontSize: '16px' }}>Giỏ hàng của bạn đang trống</span>}
        >
          <Button type="primary" size="large" style={{ background: 'var(--primary-color)' }} onClick={() => navigate('/danh-muc')}>
            Tiếp tục mua sắm
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="client-container page-container">
      <Breadcrumb
        items={[
          { title: <Link to="/">Trang chủ</Link> },
          { title: 'Giỏ hàng' },
        ]}
        className="mb-24"
      />

      <h1 className="page-title mb-24">Giỏ hàng</h1>

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          {/* Free Shipping Progress */}
          {/* <div className="cart-progress-box">
            <div className="flex-between mb-8" style={{ fontSize: '14px' }}>
              <span>
                {remainingForFreeShipping > 0 
                  ? <>Mua thêm <strong>{formatPrice(remainingForFreeShipping)}</strong> để được miễn phí giao hàng!</>
                  : <span className="text-primary font-semibold">Bạn đã đủ điều kiện miễn phí giao hàng!</span>
                }
              </span>
              <span className="text-secondary">{formatPrice(freeShippingThreshold)}</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--primary-color)', transition: 'width 0.3s ease' }}></div>
            </div>
          </div> */}

          {/* Cart Header */}
          <div className="cart-list-header">
            <Checkbox 
              checked={selectedItems.length === items.length && items.length > 0}
              onChange={handleSelectAll}
              style={{ marginRight: '16px' }}
            />
            <span style={{ flex: 1 }}>Sản phẩm ({items.length})</span>
            <span style={{ width: '120px', textAlign: 'center' }}>Đơn giá</span>
            <span style={{ width: '120px', textAlign: 'center' }}>Số lượng</span>
            <span style={{ width: '120px', textAlign: 'right' }}>Thành tiền</span>
            <span style={{ width: '40px', textAlign: 'right' }}></span>
          </div>

          {/* Cart Items */}
          <div className="cart-items-box">
            {items.map((item) => (
              <div key={item.sku} className="cart-item">
                <Checkbox 
                  checked={selectedItems.includes(item.sku)}
                  onChange={(e) => handleSelectItem(item.sku, e.target.checked)}
                />
                
                <div className="flex-center" style={{ flex: 1, gap: '16px' }}>
                  <img src={item.thumbnailUrl || 'https://via.placeholder.com/80'} alt={item.name} className="cart-item-img" />
                  <div>
                    <div className="font-semibold mb-4" style={{ fontSize: '14px' }}>
                      <Link to={`/product/${item.productId}`} style={{ color: 'inherit' }}>{item.name}</Link>
                    </div>
                    {item.title && <div className="text-secondary" style={{ fontSize: '13px' }}>Phân loại: {item.title}</div>}
                    <div className="text-secondary mt-4" style={{ fontSize: '12px' }}>Kho: {item.maxStock}</div>
                  </div>
                </div>

                <div style={{ width: '120px', textAlign: 'center' }}>
                  <div className="font-semibold">{formatPrice(item.salePrice || item.price)}</div>
                  {item.salePrice && <div className="text-secondary" style={{ fontSize: '12px', textDecoration: 'line-through' }}>{formatPrice(item.price)}</div>}
                </div>

                <div style={{ width: '120px', display: 'flex', justifyContent: 'center' }}>
                  <QuantityInput 
                    value={item.quantity} 
                    onChange={(val) => updateQuantity(item.sku, val)} 
                    max={item.maxStock}
                  />
                </div>

                <div className="font-semibold text-accent" style={{ width: '120px', textAlign: 'right' }}>
                  {formatPrice((item.salePrice || item.price) * item.quantity)}
                </div>

                <div style={{ width: '40px', textAlign: 'right' }}>
                  <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeFromCart(item.sku)} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex-center gap-16 mt-16">
            <Checkbox 
              checked={selectedItems.length === items.length && items.length > 0}
              onChange={handleSelectAll}
            >
              Chọn tất cả ({items.length})
            </Checkbox>
            <Button type="link" danger onClick={handleRemoveSelected} disabled={selectedItems.length === 0} style={{ padding: 0 }}>
              Xóa đã chọn
            </Button>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="content-box sticky-box">
            <h2 className="section-title">Tóm tắt đơn hàng</h2>
            
            <div className="flex-between mb-12" style={{ fontSize: '14px' }}>
              <span className="text-secondary">Tạm tính ({selectedItems.length} sản phẩm)</span>
              <span>{formatPrice(selectedTotal)}</span>
            </div>
            
            <div className="flex-between mb-16" style={{ fontSize: '14px' }}>
              <span className="text-secondary">Phí giao hàng</span>
              <span>{selectedTotal >= freeShippingThreshold ? 'Miễn phí' : formatPrice(20000)}</span>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <div className="mb-16">
              <div className="font-semibold mb-8" style={{ fontSize: '14px' }}>Mã giảm giá</div>
              <div className="flex-center gap-8">
                <Input placeholder="Nhập mã giảm giá" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                <Button>Áp dụng</Button>
              </div>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <div className="flex-between mb-24" style={{ alignItems: 'flex-end' }}>
              <span className="font-semibold" style={{ fontSize: '16px' }}>Tổng cộng</span>
              <span className="font-bold text-accent" style={{ fontSize: '24px' }}>
                {formatPrice(selectedTotal + (selectedTotal > 0 && selectedTotal < freeShippingThreshold ? 20000 : 0))}
              </span>
            </div>

            <Button 
              type="primary" 
              size="large" 
              block 
              disabled={selectedItems.length === 0}
              onClick={() => navigate('/checkout')}
              style={{ background: 'var(--primary-color)', height: '48px', fontSize: '16px', fontWeight: 600 }}
            >
              Tiến hành thanh toán
            </Button>
            
            <div className="text-center mt-16">
              <Link to="/danh-muc" className="text-primary flex-center gap-4" style={{ fontSize: '14px', display: 'inline-flex' }}>
                <ShopOutlined /> Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}