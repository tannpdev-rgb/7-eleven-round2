import http from "@/utils/http";
import type { BrandItem } from "@/types/brand";

export function getAllBrandsAPI() {
  return http<any, BrandItem[]>({
    url: "/v1/brand/list-all",
    method: "get",
  });
}
