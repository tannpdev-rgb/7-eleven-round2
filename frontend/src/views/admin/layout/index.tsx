
import { Layout as LayoutAntd, Menu } from "antd";
import type { MenuProps } from "antd";
import {AppstoreOutlined, ShoppingOutlined} from "@ant-design/icons";
import '@/styles/admin.css';
import { Outlet, useLocation, useNavigate } from "react-router";
import Navbar from "./components/Navbar";
import { useState } from "react";
type MenuItem = Required<MenuProps>["items"][number];
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const menuItems:MenuItem[] = [
    getItem("Quản lý sản phẩm", "/admin/product", <AppstoreOutlined />),
    getItem("Quản lý đơn hàng", "/admin/order", <ShoppingOutlined />)
]

export default function Layout() {
   const [collapsed, setCollapsed] = useState(false);
   const location = useLocation();
   const navigate = useNavigate();
   const onClickMenuItem: MenuProps["onClick"] = (e) => {
    navigate(e.key);
  };

    return (
    <LayoutAntd 
    className="admin-layout-container"
    >
      <LayoutAntd.Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="admin-sidebar-logo">
            {
              collapsed ? <span>7E</span> : <h2>7-Eleven Admin</h2>
            }
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["/admin/product"]}
          defaultOpenKeys={["/" + location.pathname.split("/")[1]]}
          items={menuItems}
          selectedKeys={[location.pathname]}
          onClick={onClickMenuItem}

        />
      </LayoutAntd.Sider>
      <LayoutAntd>
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <LayoutAntd.Content className="admin-layout-content">
            <Outlet />
        </LayoutAntd.Content>
      </LayoutAntd>
    </LayoutAntd>
    );
}