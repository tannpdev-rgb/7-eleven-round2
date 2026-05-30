import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { message } from 'antd';

export type CartItem = {
  productId: number;
  sku: string;
  name: string;
  title: string;
  price: number;
  salePrice?: number;
  quantity: number;
  thumbnailUrl: string;
  maxStock: number;
};

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex((i) => i.sku === newItem.sku);
          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            const currentQuantity = updatedItems[existingItemIndex].quantity;
            const newQuantity = currentQuantity + newItem.quantity;

            if (newQuantity > newItem.maxStock) {
              message.warning(`Sản phẩm này chỉ còn ${newItem.maxStock} sản phẩm trong kho`);
              updatedItems[existingItemIndex].quantity = newItem.maxStock;
            } else {
              updatedItems[existingItemIndex].quantity = newQuantity;
              message.success('Đã cập nhật giỏ hàng');
            }
            return { items: updatedItems };
          }
          message.success('Đã thêm vào giỏ hàng');
          return { items: [...state.items, newItem] };
        });
      },

      removeFromCart: (sku) => {
        set((state) => ({
          items: state.items.filter((item) => item.sku !== sku),
        }));
      },

      updateQuantity: (sku, quantity) => {
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.sku === sku) {
              if (quantity > item.maxStock) {
                message.warning(`Sản phẩm này chỉ còn ${item.maxStock} sản phẩm trong kho`);
                return { ...item, quantity: item.maxStock };
              }
              return { ...item, quantity: Math.max(1, quantity) };
            }
            return item;
          });
          return { items: updatedItems };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const price = item.salePrice || item.price;
          return total + price * item.quantity;
        }, 0);
      },

      getCartCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'dailymart-cart',
    }
  )
);
