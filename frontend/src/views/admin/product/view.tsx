import { getProductDetailAPI } from "@/apis/product";
import type { ProductVariantResult } from "@/types/product";
import { AppstoreOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Col, Descriptions, Flex, Image, Row, Space, Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import Title from "antd/es/typography/Title";
import { useNavigate, useParams } from "react-router";

export default function ProductViewAdmin() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading } = useQuery({
    queryKey: ["productDetail", id],
    queryFn: () => getProductDetailAPI(Number(id)),
    enabled: !!id,
  });

  const variantColumns: ColumnsType<ProductVariantResult> = [
    {
      title: "STT",
      key: "index",
      width: 52,
      render: (_: unknown, __: ProductVariantResult, index: number) => index + 1,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Tên phân loại",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Giá gốc",
      dataIndex: "price",
      key: "price",
      render: (v: number) =>
        v != null ? v.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) : "—",
    },
    {
      title: "Giá khuyến mãi",
      dataIndex: "salePrice",
      key: "salePrice",
      render: (v: number) =>
        v != null ? v.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) : "—",
    },
    {
      title: "Tồn kho",
      dataIndex: "stockQuantity",
      key: "stockQuantity",
    },
  ];

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 120 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", paddingTop: 120, color: "#999" }}>
        Không tìm thấy sản phẩm.
      </div>
    );
  }

  const thumbnail = product.images?.find((img) => img.isThumbnail);

  return (
    <div>
      {/* Header */}
      <Space className="operate-container" style={{ width: "100%" }}>
        <Flex gap={8} align="center">
          <AppstoreOutlined style={{ fontSize: 16 }} />
          <Title level={5} style={{ margin: 0 }}>
            Chi tiết Sản phẩm
          </Title>
        </Flex>
        <Space>
          <Button onClick={() => navigate("/admin/product")}>Quay lại</Button>
          <Button type="primary" onClick={() => navigate(`/admin/product/edit/${id}`)}>
            Chỉnh sửa
          </Button>
        </Space>
      </Space>

      {/* Thông tin chung */}
      <Card title="Thông tin chung" style={{ marginBottom: 16 }}>
        <Row gutter={24}>
          <Col span={6}>
            <Image
              src={thumbnail?.imageUrl || product.thumbnailUrl || "https://dummyimage.com/300x300/e0e0e0/999&text=No+Image"}
              alt={product.name}
              style={{ borderRadius: 8, width: "100%", objectFit: "cover" }}
              fallback="https://dummyimage.com/300x300/e0e0e0/999&text=No+Image"
            />
          </Col>
          <Col span={18}>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Tên sản phẩm" span={2}>
                {product.name}
              </Descriptions.Item>
              <Descriptions.Item label="Mã sản phẩm">
                <Tag color="blue">{product.productCode}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Slug">{product.slug}</Descriptions.Item>
              <Descriptions.Item label="Danh mục">{product.categoryName}</Descriptions.Item>
              <Descriptions.Item label="Thương hiệu">{product.brandName}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {product.isActive ? (
                  <Tag color="success">Đang bán</Tag>
                ) : (
                  <Tag color="default">Ẩn</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {new Date(product.createdAt).toLocaleDateString("vi-VN")}
              </Descriptions.Item>
              {(!product.variants || product.variants.length === 0) && (
                <>
                  <Descriptions.Item label="Giá bán">
                    {product.price != null ? product.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) : "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giá khuyến mãi">
                    {product.salePrice != null ? product.salePrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) : "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tồn kho">
                    {product.stockQuantity ?? "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="" />
                </>
              )}
              <Descriptions.Item label="Mô tả ngắn" span={2}>
                {product.shortDescription}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả chi tiết" span={2}>
                {product.description}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>

      {/* Hình ảnh sản phẩm */}
      <Card title="Hình ảnh sản phẩm" style={{ marginBottom: 16 }}>
        {product.images && product.images.length > 0 ? (
          <Image.PreviewGroup>
            <Flex gap={16} wrap="wrap">
              {product.images.map((img) => (
                <div key={img.id} style={{ position: "relative" }}>
                  <Image
                    src={img.imageUrl}
                    width={120}
                    height={120}
                    style={{ objectFit: "cover", borderRadius: 8 }}
                    fallback="https://dummyimage.com/120x120/e0e0e0/999&text=Err"
                  />
                  {img.isThumbnail && (
                    <Tag
                      color="orange"
                      style={{ position: "absolute", top: 4, left: 4, fontSize: 10 }}
                    >
                      Thumbnail
                    </Tag>
                  )}
                </div>
              ))}
            </Flex>
          </Image.PreviewGroup>
        ) : (
          <div style={{ color: "#999" }}>Chưa có hình ảnh nào.</div>
        )}
      </Card>

      {/* Biến thể sản phẩm */}
      {product.variants && product.variants.length > 0 && (
        <Card title="Biến thể sản phẩm">
          <Table<ProductVariantResult>
            rowKey="id"
            columns={variantColumns}
            dataSource={product.variants}
            pagination={false}
            size="small"
          />
        </Card>
      )}
    </div>
  );
}
