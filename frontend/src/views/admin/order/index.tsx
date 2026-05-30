import { getOrderListAPI, updateOrderStatusAPI } from "@/apis/order";
import type { Order, OrderQueryParam } from "@/types/order";
import { ORDER_STATUS, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, type OrderStatus, PAYMENT_STATUS, PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from "@/constants/order";
import { ShoppingOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Flex, Input, Modal, Select, Space, Table, Tag, message, DatePicker } from "antd";
import dayjs from "dayjs";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function OrderListAdmin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [listQuery, setListQuery] = useState<OrderQueryParam>({
    pageNum: 1,
    pageSize: 10,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>("PENDING");

  const { data, isLoading } = useQuery({
    queryKey: ["orderList", listQuery],
    queryFn: () => getOrderListAPI(listQuery),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderCode, status }: { orderCode: string; status: string }) =>
      updateOrderStatusAPI(orderCode, status),
    onSuccess: () => {
      message.success("Cập nhật trạng thái đơn hàng thành công!");
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["orderList"] });
    },
    onError: () => {
      message.error("Cập nhật trạng thái thất bại.");
    }
  });

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setListQuery((prev) => ({
      ...prev,
      pageNum: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? 10,
    }));
  };

  const openStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus as OrderStatus);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = () => {
    if (selectedOrder && newStatus) {
      updateStatusMutation.mutate({ orderCode: selectedOrder.orderCode, status: newStatus });
    }
  };

  const columns: ColumnsType<Order> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderCode",
      key: "orderCode",
      render: (code: string) =><span>#{code}</span>,
    },
    {
      title: "Khách hàng",
      key: "customer",
      render: (record: Order) => (
        <Flex vertical gap={2}>
          <span style={{ fontWeight: 600 }}>{record.customerName}</span>
          <span style={{ color: "#8c8c8c", fontSize: 12 }}>{record.customerPhone}</span>
        </Flex>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (v: number) => (v != null ? v.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) : "—"),
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status: string) => (
        <Tag color={PAYMENT_STATUS_COLORS[status] || "default"}>
          {PAYMENT_STATUS_LABELS[status] || status}
        </Tag>
      ),
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status: string) => {
        const key = status as OrderStatus;
        return <Tag color={ORDER_STATUS_COLORS[key] || "default"}>{ORDER_STATUS_LABELS[key] || status}</Tag>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      render: (_: unknown, record: Order) => (
        <Flex gap={8}>
          <Button size="small" type="primary" ghost onClick={() => navigate(`/admin/order/view/${record.orderCode}`)}>
            Chi tiết
          </Button>
          <Button size="small" onClick={() => openStatusModal(record)}>
            Cập nhật trạng thái
          </Button>
        </Flex>
      ),
    },
  ];

  return (
    <div>
      {/* filter container */}
      <Space className="filter-container">
        <Input
          placeholder="SĐT..."
          value={listQuery.customerPhone || ""}
          onChange={(e) => setListQuery((prev) => ({ ...prev, customerPhone: e.target.value, pageNum: 1 }))}
          style={{ width: 150 }}
          allowClear
        />
        <Input
          placeholder="Email..."
          value={listQuery.customerEmail || ""}
          onChange={(e) => setListQuery((prev) => ({ ...prev, customerEmail: e.target.value, pageNum: 1 }))}
          style={{ width: 180 }}
          allowClear
        />
        <Select
          placeholder="Trạng thái"
          value={listQuery.orderStatus || undefined}
          onChange={(val) => setListQuery((prev) => ({ ...prev, orderStatus: val, pageNum: 1 }))}
          style={{ width: 150 }}
          allowClear
          options={Object.keys(ORDER_STATUS).map((key) => ({
            label: ORDER_STATUS_LABELS[key as OrderStatus],
            value: key,
          }))}
        />
        <Select
          placeholder="Thanh toán"
          value={listQuery.paymentStatus || undefined}
          onChange={(val) => setListQuery((prev) => ({ ...prev, paymentStatus: val, pageNum: 1 }))}
          style={{ width: 150 }}
          allowClear
          options={Object.keys(PAYMENT_STATUS).map((key) => ({
            label: PAYMENT_STATUS_LABELS[key],
            value: key,
          }))}
        />
        <DatePicker.RangePicker
          onChange={(dates) => {
            if (dates && dates[0] && dates[1]) {
              setListQuery((prev) => ({
                ...prev,
                fromDate: dates[0]!.format("YYYY-MM-DD"),
                toDate: dates[1]!.format("YYYY-MM-DD"),
                pageNum: 1,
              }));
            } else {
              setListQuery((prev) => ({
                ...prev,
                fromDate: undefined,
                toDate: undefined,
                pageNum: 1,
              }));
            }
          }}
        />
      </Space>

      {/* operate-container */}
      <Space className="operate-container" style={{ width: "100%" }}>
        <Flex gap={8} align="center">
          <ShoppingOutlined style={{ fontSize: 16 }} />
          <Title level={5} style={{ margin: 0 }}>
            Quản lý Đơn hàng
          </Title>
        </Flex>
      </Space>

      {/* table-container */}
      <div className="table-container">
        <Table<Order>
          rowKey="id"
          columns={columns}
          dataSource={data?.list ?? []}
          loading={isLoading}
          pagination={{
            current: listQuery.pageNum,
            pageSize: listQuery.pageSize,
            total: data?.total ?? 0,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} đơn hàng`,
          }}
          onChange={handleTableChange}
        />
      </div>

      <Modal
        title="Cập nhật trạng thái đơn hàng"
        open={isModalOpen}
        onOk={handleUpdateStatus}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={updateStatusMutation.isPending}
      >
        {selectedOrder && (
          <Space direction="vertical" style={{ width: "100%" }}>
            <p>Mã đơn hàng: <strong>{selectedOrder.orderCode}</strong></p>
            <p>Khách hàng: {selectedOrder.customerName}</p>
            <Select
              style={{ width: "100%" }}
              value={newStatus}
              onChange={(val) => setNewStatus(val as OrderStatus)}
              options={Object.keys(ORDER_STATUS).map((key) => ({
                label: ORDER_STATUS_LABELS[key as OrderStatus],
                value: key,
              }))}
            />
          </Space>
        )}
      </Modal>
    </div>
  );
}
