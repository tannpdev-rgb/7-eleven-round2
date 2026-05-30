export type ProductItem = {
  id: number;
  name: string;
  slug: string;
  productCode: string;
  shortDescription: string;
  isActive: boolean;
  categoryId: number;
  categoryName: string;
  brandId: number;
  brandName: string;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductListQueryParam = {
  pageNum: number;
  pageSize: number;
  brandId?: number;
};

export type ProductImageParam = {
  productId?: number;
  imageUrl: string;
  isThumbnail: boolean;
  displayOrder?: number;
};

export type ProductVariantParam = {
  productId?: number;
  sku: string;
  title: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  imageUrl?: string;
};

export type ProductParam = {
  name: string;
  productCode: string;
  shortDescription: string;
  description: string;
  isActive: boolean;
  categoryId: number;
  brandId: number;
  productImageList: ProductImageParam[];
  productVariantList: ProductVariantParam[];
  price?: number;
  salePrice?: number;
  stockQuantity?: number;
  defaultVariantIndex?: number;
};

export type ProductImageResult = {
  id: number;
  productId: number;
  imageUrl: string;
  isThumbnail: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ProductVariantResult = {
  id: number;
  productId: number;
  sku: string;
  title: string;
  price: number;
  salePrice: number;
  stockQuantity: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductDetailResult = {
  id: number;
  name: string;
  slug: string;
  productCode: string;
  shortDescription: string;
  description: string;
  isActive: boolean;
  categoryId: number;
  brandId: number;
  categoryName: string;
  brandName: string;
  thumbnailUrl: string;
  price: number;
  salePrice: number;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
  images: ProductImageResult[];
  variants: ProductVariantResult[];
};
