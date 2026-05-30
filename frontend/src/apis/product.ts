import http from "@/utils/http";
import type { CommonPage } from "@/types/common";
import type { ProductItem, ProductListQueryParam, ProductParam, ProductDetailResult } from "@/types/product";

export function getProductDetailAPI(id: number) {
  return http<any, ProductDetailResult>({
    url: `/v1/product/detail/${id}`,
    method: "get",
  });
}

export function getClientProductDetailAPI(slug: string) {
  return http<any, ProductDetailResult>({
    url: `/v1/client/product/detail/${slug}`,
    method: "get",
  });
}


export function getProductListAPI(params: ProductListQueryParam) {
  return http<any, CommonPage<ProductItem>>({
    url: "/v1/product/list",
    method: "get",
    params,
  });
}

export function getClientProductListAPI(params: ProductListQueryParam & { categorySlug?: string, keyword?: string, categoryId?: number }) {
  return http<any, CommonPage<ProductItem>>({
    url: "/v1/client/product/list",
    method: "get",
    params,
  });
}

export function createProductAPI(data: ProductParam) {
  return http<any, number>({
    url: "/v1/product/create",
    method: "post",
    data,
  });
}

export function checkSkuAPI(sku: string) {
  return http<any, boolean>({
    url: "/v1/product/check-sku",
    method: "get",
    params: { sku },
  });
}

export function deleteProductAPI(id: number) {
  return http<any, number>({
    url: `/v1/product/delete/${id}`,
    method: "delete",
  });
}
