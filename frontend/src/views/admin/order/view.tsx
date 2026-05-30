import { getOrderDetailAPI } from "@/apis/order";
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, type OrderStatus, PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from "@/constants/order";
import type { OrderItemResult } from "@/types/order";
import { ShoppingOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Col, Descriptions, Flex, Row, Space, Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import Title from "antd/es/typography/Title";
import { useNavigate, useParams } from "react-router";

export default function OrderViewAdmin() {
  const { orderCode } = useParams<{ orderCode: string }>();
  const navigate = useNavigate();

  const { data: order, isLoading } = useQuery({
    queryKey: ["orderDetail", orderCode],
    queryFn: () => getOrderDetailAPI(orderCode as string),
    enabled: !!orderCode,
  });

  const itemColumns: ColumnsType<OrderItemResult> = [
    {
      title: "STT",
      key: "index",
      width: 52,
      render: (_: unknown, __: OrderItemResult, index: number) => index + 1,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (v: number) => v.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (v: number) => <strong style={{ color: "red" }}>{v.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</strong>,
    },
  ];

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 120 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ textAlign: "center", paddingTop: 120, color: "#999" }}>
        Không tìm thấy thông tin đơn hàng.
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <Space className="operate-container" style={{ width: "100%" }}>
        <Flex gap={8} align="center">
          <ShoppingOutlined style={{ fontSize: 16 }} />
          <Title level={5} style={{ margin: 0 }}>
            Chi tiết Đơn hàng: <span style={{ color: "#1677ff" }}>{order.orderCode}</span>
          </Title>
        </Flex>
        <Space>
          <Button onClick={() => navigate("/admin/order")}>Quay lại danh sách</Button>
        </Space>
      </Space>

      {/* Thông tin khách hàng & giao hàng */}
      <Card title="Thông tin khách hàng & Giao hàng" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="Tên khách hàng">{order.customerName}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{order.customerPhone}</Descriptions.Item>
          <Descriptions.Item label="Email">{order.customerEmail}</Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {new Date(order.createdAt).toLocaleString("vi-VN")}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ giao hàng" span={2}>
            {order.shippingAddress}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái đơn hàng">
            <Tag color={ORDER_STATUS_COLORS[order.orderStatus as OrderStatus] || "default"}>
              {ORDER_STATUS_LABELS[order.orderStatus as OrderStatus] || order.orderStatus}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái thanh toán">
            <Tag color={PAYMENT_STATUS_COLORS[order.paymentStatus] || "default"}>
              {PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Danh sách sản phẩm */}
      <Card title="Danh sách sản phẩm" style={{ marginBottom: 16 }}>
        <Table<OrderItemResult>
          rowKey="sku"
          columns={itemColumns}
          dataSource={order.items || []}
          pagination={false}
          size="small"
        />
        <Row justify="end" style={{ marginTop: 24 }}>
          <Col span={8}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Tổng tiền hàng">
                {order.totalAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
              </Descriptions.Item>
              <Descriptions.Item label="Phí giao hàng">
                {order.shippingFee.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
              </Descriptions.Item>
              <Descriptions.Item label="Giảm giá">
                - {order.discountAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng thanh toán">
                <strong style={{ color: "red", fontSize: 16 }}>
                  {order.finalAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                </strong>
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                {order.paymentMethod}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
