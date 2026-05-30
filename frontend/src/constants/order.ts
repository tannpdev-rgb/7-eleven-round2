export const ORDER_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;

export type OrderStatus = keyof typeof ORDER_STATUS;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Chờ xác nhận",
  PROCESSING: "Đang xử lý",
  SHIPPED: "Đang giao hàng",
  DELIVERED: "Đã giao hàng",
  CANCELLED: "Đã hủy",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "orange",
  PROCESSING: "blue",
  SHIPPED: "purple",
  DELIVERED: "success",
  CANCELLED: "error",
};

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
} as const;

export type PaymentStatus = keyof typeof PAYMENT_STATUS;

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Chưa thanh toán",
  PAID: "Đã thanh toán",
  FAILED: "Thất bại",
};

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  PENDING: "default",
  PAID: "success",
  FAILED: "error",
};
