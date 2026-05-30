export type Order = {
  id: number;
  orderCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
};

export type OrderQueryParam = {
  pageNum?: number;
  pageSize?: number;
  orderStatus?: string;
  paymentStatus?: string;
  customerPhone?: string;
  customerEmail?: string;
  fromDate?: string;
  toDate?: string;
};

export type OrderItemResult = {
  sku: string;
  productName: string;
  price: number;
  quantity: number;
  totalPrice: number;
};

export type OrderResult = {
  orderCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items: OrderItemResult[];
};
