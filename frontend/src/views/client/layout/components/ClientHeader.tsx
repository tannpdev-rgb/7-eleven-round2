import React from 'react';
import { Input, Badge, Button, Dropdown } from 'antd';
import { 
  SearchOutlined, 
  ShoppingCartOutlined, 
  UserOutlined, 
  MenuOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';

const { Search } = Input;

export default function ClientHeader() {
  const navigate = useNavigate();
  const cartCount = useCartStore((state) => state.getCartCount());

  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/category?search=${encodeURIComponent(value)}`);
    }
  };

  return (
    <header className="client-header">
      <div className="client-container client-header-container">
        
        {/* Logo & Category */}
        <div className="client-header-left">
          <Link to="/" className="client-logo-link">
            <span className="client-logo-text">DailyMart</span>
          </Link>
          
          {/* <Dropdown menu={{ items: categoryItems }} trigger={['click']}>
            <Button icon={<MenuOutlined />}>Danh mục</Button>
          </Dropdown> */}
        </div>

        {/* Search */}
        <div className="client-search-wrapper">
          <Search 
            placeholder="Tìm kiếm sản phẩm..." 
            onSearch={handleSearch}
            enterButton={<Button style={{ background: 'var(--primary-color)', borderColor: 'var(--primary-color)' }} type="primary" icon={<SearchOutlined />} />}
            size="large"
          />
        </div>

        {/* Right Actions */}
        <div className="client-header-right">
          {/* <div className="client-delivery-info">
            <EnvironmentOutlined style={{ fontSize: '18px', color: 'var(--primary-color)' }} />
            <div className="client-delivery-text">
              <span className="text-secondary">Giao đến</span>
              <strong className="text-main">221B Baker Street</strong>
            </div>
          </div> */}
          
          {/* <Button type="text" icon={<UserOutlined style={{ fontSize: '20px' }} />} /> */}
          
          <Link to="/cart">
            <Badge count={cartCount} color="var(--accent-color)">
              <Button type="text" icon={<ShoppingCartOutlined style={{ fontSize: '22px' }} />} />
            </Badge>
          </Link>
        </div>

      </div>
    </header>
  );
}
