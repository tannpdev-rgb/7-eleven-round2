export type CommonResult<T> = {
  code: number;
  message: string;
  data: T;
};
export type CommonPage<T> = {
  list: T[];
  page: number;
  size: number;
  total: number;
  totalPage: number;
};

export type PageParam = {
  pageNum: number;
  pageSize: number;
  keyword?: string;
};