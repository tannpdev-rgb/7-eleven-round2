import http from "@/utils/http";
import type { CategoryItem } from "@/types/category";

export function getAllCategoriesAPI() {
  return http<any, CategoryItem[]>({
    url: "/v1/category/list-all",
    method: "get",
  });
}

export function getClientCategoriesAPI() {
  return http<any, CategoryItem[]>({
    url: "/v1/client/category/list",
    method: "get",
  });
}
