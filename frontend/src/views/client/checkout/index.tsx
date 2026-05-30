import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Breadcrumb, Row, Col, Form, Input, Button, Radio, Divider, message } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useCartStore } from '@/store/cartStore';

export default function CheckoutClient() {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCartStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Trong thực tế, chỉ thanh toán các item được chọn từ giỏ hàng.
  // Ở đây giả định thanh toán tất cả item có trong cart store.
  const totalAmount = getCartTotal();
  const shippingFee = totalAmount >= 200000 ? 0 : 20000;
  const finalAmount = totalAmount + shippingFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const onFinish = async (values: any) => {
    if (items.length === 0) {
      message.error('Giỏ hàng trống!');
      return;
    }
    
    setLoading(true);
    try {
      // TODO: Call API create order here
      console.log('Submit Order', {
        ...values,
        items,
        totalAmount,
        shippingFee,
        finalAmount
      });
      
      // Giả lập delay gọi API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      message.success('Đặt hàng thành công!');
      clearCart();
      navigate('/'); // Redirect to success page or home
    } catch (error) {
      message.error('Có lỗi xảy ra khi đặt hàng');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="client-container page-container text-center">
        <h2>Không có sản phẩm nào để thanh toán</h2>
        <Button type="primary" onClick={() => navigate('/danh-muc')} className="mt-16">
          Quay lại mua sắm
        </Button>
      </div>
    );
  }

  return (
    <div className="client-container page-container">
      <Breadcrumb
        items={[
          { title: <Link to="/cart">Giỏ hàng</Link> },
          { title: 'Thanh toán' },
        ]}
        className="mb-24"
      />

      <h1 className="page-title mb-24">Thanh toán</h1>

      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ paymentMethod: 'COD', deliveryTime: 'now' }}>
        <Row gutter={48}>
          <Col xs={24} lg={14}>
            {/* Thông tin giao hàng */}
            <div className="content-box">
              <h2 className="section-title">Thông tin giao hàng</h2>
              
              <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
                <Input size="large" placeholder="Nguyễn Văn A" />
              </Form.Item>
              
              <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                <Input size="large" placeholder="0123 456 789" />
              </Form.Item>
              
              <Form.Item name="address" label="Địa chỉ giao hàng" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
                <Input.TextArea size="large" placeholder="221B Baker Street, Quận 1, HCM" rows={3} />
              </Form.Item>

              <Form.Item name="note" label="Ghi chú cho đơn hàng (tùy chọn)">
                <Input.TextArea size="large" placeholder="Giao trước 6h chiều..." rows={2} />
              </Form.Item>
            </div>

            {/* Thời gian giao hàng */}
            {/* <div className="content-box">
              <h2 className="section-title">Thời gian giao hàng</h2>
              <Form.Item name="deliveryTime" noStyle>
                <Radio.Group style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Radio value="now">Giao ngay (30 phút)</Radio>
                  <Radio value="18-19">Giao 18:00 - 19:00</Radio>
                  <Radio value="19-20">Giao 19:00 - 20:00</Radio>
                </Radio.Group>
              </Form.Item>
            </div> */}

            {/* Phương thức thanh toán */}
            <div className="content-box">
              <h2 className="section-title">Phương thức thanh toán</h2>
              <Form.Item name="paymentMethod" noStyle>
                <Radio.Group style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Radio value="COD">Thanh toán khi nhận hàng (COD)</Radio>
                  {/* <Radio value="VNPAY">VNPay</Radio>
                  <Radio value="MOMO">MoMo</Radio>
                  <Radio value="ZALOPAY">ZaloPay</Radio>
                  <Radio value="CARD">Thẻ ngân hàng</Radio> */}
                </Radio.Group>
              </Form.Item>
            </div>
          </Col>

          <Col xs={24} lg={10}>
            {/* Đơn hàng của bạn */}
            <div className="content-box sticky-box" style={{ background: '#fafafa' }}>
              <h2 className="section-title">Đơn hàng của bạn</h2>
              <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '16px', paddingRight: '8px' }}>
                {items.map((item, index) => (
                  <div key={item.sku} className="checkout-item">
                    <div style={{ position: 'relative' }}>
                      <img src={item.thumbnailUrl} alt={item.name} className="checkout-item-img" />
                      <div style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--text-secondary)', color: 'white', fontSize: '10px', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                        {item.quantity}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="font-semibold mb-4" style={{ fontSize: '14px', lineHeight: 1.3 }}>{item.name}</div>
                      {item.title && <div className="text-secondary" style={{ fontSize: '12px' }}>{item.title}</div>}
                    </div>
                    <div className="font-semibold">
                      {formatPrice((item.salePrice || item.price) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <Divider style={{ margin: '16px 0' }} />

              <div className="flex-between mb-12" style={{ fontSize: '14px' }}>
                <span className="text-secondary">Tạm tính</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              
              <div className="flex-between mb-12" style={{ fontSize: '14px' }}>
                <span className="text-secondary">Phí giao hàng</span>
                <span>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
              </div>

              <Divider style={{ margin: '16px 0' }} />

              <div className="flex-between mb-24" style={{ alignItems: 'center' }}>
                <span className="font-semibold" style={{ fontSize: '16px' }}>Tổng cộng</span>
                <span className="font-bold text-accent" style={{ fontSize: '24px' }}>
                  {formatPrice(finalAmount)}
                </span>
              </div>

              <Button 
                type="primary" 
                htmlType="submit"
                size="large" 
                block 
                loading={loading}
                className="mb-12"
                style={{ background: 'var(--primary-color)', height: '48px', fontSize: '16px', fontWeight: 600 }}
              >
                ĐẶT HÀNG NGAY
              </Button>
              
              <div className="text-center text-secondary" style={{ fontSize: '12px' }}>
                Bằng việc đặt hàng, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật của chúng tôi.
              </div>

              <div className="mt-16">
                <Link to="/cart" className="text-secondary flex-center gap-4" style={{ display: 'inline-flex' }}>
                  <LeftOutlined /> Quay lại giỏ hàng
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
}