import http from "@/utils/http";
import type { CommonPage } from "@/types/common";
import type { Order, OrderQueryParam, OrderResult } from "@/types/order";

export function getOrderListAPI(params: OrderQueryParam) {
  return http<any, CommonPage<Order>>({
    url: "/v1/order/list",
    method: "get",
    params,
  });
}

export function getOrderDetailAPI(orderCode: string) {
  return http<any, OrderResult>({
    url: `/v1/order/detail/${orderCode}`,
    method: "get",
  });
}

export function updateOrderStatusAPI(orderCode: string, status: string) {
  return http<any, number>({
    url: `/v1/order/status/${orderCode}`,
    method: "put",
    params: { status },
  });
}