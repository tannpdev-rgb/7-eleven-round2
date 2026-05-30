import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeOutlined, 
  AppstoreOutlined, 
  SearchOutlined, 
  ShoppingCartOutlined, 
  UserOutlined 
} from '@ant-design/icons';
import { Badge } from 'antd';
import { useCartStore } from '@/store/cartStore';

export default function BottomNav() {
  const cartCount = useCartStore((state) => state.getCartCount());
  const navItems = [
    { to: '/', icon: <HomeOutlined />, label: 'Trang chủ' },
    { to: '/danh-muc', icon: <AppstoreOutlined />, label: 'Danh mục' },
    // { to: '/search', icon: <SearchOutlined />, label: 'Tìm kiếm' },
    { 
      to: '/cart', 
      icon: (
        <Badge count={cartCount} size="small" color="var(--accent-color)">
          <ShoppingCartOutlined style={{ fontSize: '20px' }} />
        </Badge>
      ), 
      label: 'Giỏ hàng' 
    },
    // { to: '/profile', icon: <UserOutlined />, label: 'Tài khoản' },
  ];

  return (
    <div className="bottom-nav">
      {navItems.map((item, index) => (
        <NavLink 
          key={index} 
          to={item.to}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="bottom-nav-icon" style={{ fontSize: item.icon.type === Badge ? 'auto' : undefined }}>
            {item.icon}
          </div>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
}
