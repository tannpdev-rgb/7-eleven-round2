import React from 'react';

export default function ClientFooter() {
  return (
    <footer className="client-footer">
      <div className="client-container client-footer-grid">
        <div>
          <h3 className="client-footer-title">DailyMart</h3>
          <p className="client-footer-text">
            Siêu thị tiện lợi trực tuyến của bạn. Mua sắm mọi lúc, mọi nơi với mức giá tốt nhất và giao hàng nhanh chóng.
          </p>
        </div>
        
        <div>
          <h4 className="client-footer-title">Về chúng tôi</h4>
          <ul className="client-footer-list">
            <li>Giới thiệu</li>
            <li>Tuyển dụng</li>
            <li>Chính sách bảo mật</li>
            <li>Điều khoản sử dụng</li>
          </ul>
        </div>
        
        <div>
          <h4 className="client-footer-title">Hỗ trợ khách hàng</h4>
          <ul className="client-footer-list">
            <li>Trung tâm trợ giúp</li>
            <li>Hướng dẫn mua hàng</li>
            <li>Chính sách đổi trả</li>
            <li>Liên hệ</li>
          </ul>
        </div>

        <div>
          <h4 className="client-footer-title">Liên hệ</h4>
          <ul className="client-footer-list">
            <li>Hotline: 1900 1234</li>
            <li>Email: support@dailymart.vn</li>
            <li>Địa chỉ: 221B Baker Street, Quận 1, TP.HCM</li>
          </ul>
        </div>
      </div>
      
      <div className="client-container client-footer-bottom">
        © {new Date().getFullYear()} DailyMart. All rights reserved.
      </div>
    </footer>
  );
}
