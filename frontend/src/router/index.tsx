
import { createBrowserRouter, Navigate, type RouteObject } from "react-router-dom";
import Layout from "../views/admin/layout";
import LayoutClient from "../views/client/layout";
import ProductListAdmin from "../views/admin/product";
import ProductAddAdmin from "../views/admin/product/add";
import ProductUpdateAdmin from "../views/admin/product/update";
import ProductViewAdmin from "../views/admin/product/view";
import OrderListAdmin from "../views/admin/order";
import OrderViewAdmin from "../views/admin/order/view";
import ProductClient from "@/views/client/product";
import CartClient from "@/views/client/cart";
import CheckoutClient from "@/views/client/checkout";
import ProductDetailClient from "@/views/client/product/detail";

export const routerMap: RouteObject[] = [
  {
    path: "/admin/product",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ProductListAdmin />,
      },
      {
        path: "add",
        element: <ProductAddAdmin />,
      },
      {
        path: "view/:id",
        element: <ProductViewAdmin />,
      },
      {
        path: "edit/:id",
        element: <ProductUpdateAdmin />,
      },
    ],
  },
  {
    path: "/admin/order",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <OrderListAdmin />,
      },
      {
        path: "view/:orderCode",
        element: <OrderViewAdmin />,
      },
    ],
  },
];

export const routerClient: RouteObject[] = [
  {
    element: <LayoutClient />,
    path: "/",
    children: [
      {
        index: true,
        element: <Navigate to="/category" replace />,
      },
      {
        path: "/category",
        element: <ProductClient />,
      },
      {
        path: "/category/:slug",
        element: <ProductClient />,
      },
      {
        path: "/product/:slug",
        element: <ProductDetailClient />,
      },
      {
        path: "/cart",
        element: <CartClient />,
      },
  {
    path: "/checkout",
    element: <CheckoutClient />,
  }
    ]
  }
];

const router = createBrowserRouter([...routerMap, ...routerClient]);
export default router;