import axios from "axios";
import type { CommonResult } from "@/types/common";
import { message } from "antd";

const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_SERVER_URL,
  timeout: 5000,
});

http.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 200 && res.code !== 201) {
      message.error(res.message || "Có lỗi xảy ra");
      return Promise.reject(new Error(res.message || "Error"));
    }
    return res.data as any;
  },
  (error) => {
    message.error("Có lỗi xảy ra: " + (error.response?.data?.message || error.message || ""));
    return Promise.reject(error);
  },
);

export default http;
