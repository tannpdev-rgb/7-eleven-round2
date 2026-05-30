import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button} from "antd";
import { useLocation, Link } from "react-router-dom";

type Props = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

export default function Navbar({ collapsed, setCollapsed }: Props) {
  const location = useLocation();

  const getBreadcrumbItems = () => {
    const paths = location.pathname.split("/").filter(Boolean);
    const items: any[] = [
      {
        title: <Link to="/admin"><HomeOutlined /></Link>,
      },
    ];

    let currentUrl = "";
    
    const breadcrumbMap: Record<string, string> = {
      "admin": "Admin",
      "product": "Quản lý Sản phẩm",
      "order": "Quản lý Đơn hàng",
      "add": "Thêm mới",
      "edit": "Chỉnh sửa",
      "view": "Chi tiết",
    };

    paths.forEach((path, index) => {
      if (index > 0 && paths[index - 1] === "view") {
        return; 
      }

      currentUrl += `/${path}`;
      
      let title = breadcrumbMap[path] || path;
      if (!breadcrumbMap[path]) {
        title = title.charAt(0).toUpperCase() + title.slice(1);
      }

      const isLastVisible = index === paths.length - 1 || (index === paths.length - 2 && paths[index] === "view");

      let content;
      if (isLastVisible) {
        content = <span>{title}</span>; 
      } else if (path === "edit" || path === "view") {
        content = <span>{title}</span>;
      } else {
        content = <Link to={currentUrl}>{title}</Link>;
      }

      items.push({
        title: content,
      });
    });

    return items;
  };

  return (
    <div
      className="navbar"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
        height: 64,
        background: "#fff",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Button
          className="layout-trigger"
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}
        />
        {/* breadcrumb */}
        <Breadcrumb items={getBreadcrumbItems()} />
      </div>
    </div>
  );
}