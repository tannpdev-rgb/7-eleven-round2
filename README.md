# DailyMart - Convenience Store E-commerce Platform

DailyMart là một hệ thống thương mại điện tử toàn diện (Full-stack E-commerce System) được thiết kế theo mô hình cửa hàng tiện lợi (như 7-Eleven, Circle K). Hệ thống bao gồm giao diện mua sắm dành cho khách hàng (Client Storefront) và hệ thống quản trị dành cho nhân viên (Admin Dashboard).

## Công nghệ sử dụng (Technology Stack)

**Frontend:**
- React 18 (sử dụng Vite để tối ưu tốc độ build)
- TypeScript
- Ant Design (UI Framework)
- Zustand (State Management quản lý giỏ hàng)
- TanStack Query (Data Fetching & Caching)
- React Router v6

**Backend:**
- Java 17
- Spring Boot 3.3.2
- PostgreSQL 16
- MyBatis 3 (Data Access Layer)
- Flyway (Database Migration & Seeding)

**Infrastructure & Deployment:**
- Docker & Docker Compose
- Nginx (Reverse Proxy & Static File Serving)
- GitHub Actions (CI/CD)

---

## Tính năng nổi bật (Key Features)

### Giao diện Khách hàng (Client Storefront)
- Duyệt sản phẩm trực quan, phân loại theo danh mục đa cấp.
- Tìm kiếm sản phẩm theo từ khóa (Full-text search).
- Trang chi tiết sản phẩm đầy đủ thông tin, hỗ trợ nhiều biến thể (variants/SKU).
- Giỏ hàng thời gian thực (Zustand) tự động tính toán tổng tiền và điều kiện miễn phí vận chuyển.
- Quy trình thanh toán (Checkout) thân thiện với người dùng.
- Giao diện Responsive hoạt động tốt trên cả thiết bị di động và máy tính.

### Hệ thống Quản trị (Admin Dashboard)
- **Quản lý Sản phẩm:** Thêm, sửa, xóa sản phẩm, quản lý số lượng tồn kho và các biến thể (SKU).
- **Quản lý Danh mục & Thương hiệu:** Sắp xếp cấu trúc dữ liệu theo cây phân cấp.
- **Quản lý Đơn hàng:** Theo dõi và cập nhật trạng thái đơn hàng, trạng thái thanh toán và vận chuyển.
- API phân quyền riêng biệt đảm bảo tính bảo mật dữ liệu.

---

## Hướng dẫn cài đặt (Getting Started)

Dự án được đóng gói sẵn để có thể chạy mượt mà thông qua Docker. 

### Yêu cầu hệ thống (Prerequisites)
- Docker và Docker Compose đã được cài đặt.
- Node.js 20+ (Nếu muốn phát triển Frontend nội bộ).
- JDK 17 & Maven (Nếu muốn phát triển Backend nội bộ).

### Chạy hệ thống bằng Docker (Môi trường Production)

Cách nhanh nhất để khởi động toàn bộ hệ thống là sử dụng Docker Compose. Hệ thống sẽ tự động khởi tạo Database, cấp phát dữ liệu mẫu (Seed Data), biên dịch Frontend và chạy Backend.

1. Clone repository về máy:
   ```bash
   git clone https://github.com/tannpdev-rgb/7-eleven-round2.git
   cd 7-eleven-round2
   ```

2. Khởi chạy toàn bộ các dịch vụ:
   ```bash
   docker compose up --build -d
   ```

3. Truy cập ứng dụng:
   - Frontend (Storefront & Admin): `http://localhost`
   - Backend API: `http://localhost:8080`
   - Database (PostgreSQL): `localhost:5432`

---

### Môi trường Phát triển (Local Development)

Nếu bạn muốn thay đổi mã nguồn và cần tính năng Hot-Reloading:

**Cài đặt Backend:**
1. Mở terminal tại thư mục `/backend`.
2. Khởi chạy Database thông qua Docker: `docker compose up -d db`.
3. Chạy ứng dụng Spring Boot:
   ```bash
   mvn spring-boot:run
   ```

**Cài đặt Frontend:**
1. Mở terminal tại thư mục `/frontend`.
2. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
3. Khởi chạy Development Server:
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ chạy tại `http://localhost:5173`.

---

## Cấu trúc thư mục (Project Structure)

```text
7-eleven-round2/
├── backend/                  # Mã nguồn Spring Boot Backend
│   ├── src/main/java/        # Logic xử lý (Controllers, Services, DTOs, Security)
│   ├── src/main/resources/   # Cấu hình (application.yml, MyBatis XML, Flyway SQL)
│   └── Dockerfile            # Multi-stage build cho Backend
├── frontend/                 # Mã nguồn React Frontend
│   ├── src/apis/             # Các API Services kết nối với Backend
│   ├── src/components/       # UI Components tái sử dụng
│   ├── src/views/admin/      # Các trang dành cho quản trị viên
│   ├── src/views/client/     # Các trang dành cho khách hàng
│   ├── Dockerfile            # Multi-stage build cho Frontend (Nginx)
│   └── nginx.conf            # Cấu hình Nginx routing và Proxy
├── docker-compose.yml        # Orchestration file để liên kết DB, Backend, Frontend
└── README.md                 # Tài liệu dự án
```
