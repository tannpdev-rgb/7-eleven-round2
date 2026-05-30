import { getProductListAPI, deleteProductAPI } from "@/apis/product";
import type { ProductItem, ProductListQueryParam } from "@/types/product";
import { AppstoreOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Flex, Image, Input, Modal, Space, Table, Tag, message } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function ProductListAdmin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [listQuery, setListQuery] = useState<ProductListQueryParam>({
    pageNum: 1,
    pageSize: 10,
  });
  const [keyword, setKeyword] = useState("");

  const deleteMutation = useMutation({
    mutationFn: deleteProductAPI,
    onSuccess: () => {
      message.success("Xóa sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["productList"] });
    },
  });

  const handleDelete = (record: ProductItem) => {
    Modal.confirm({
      title: "Xác nhận xóa sản phẩm",
      icon: <ExclamationCircleFilled />,
      content: (
        <span>
          Bạn có chắc chắn muốn xóa sản phẩm <strong>{record.name}</strong> không? Hành động này không thể hoàn tác.
        </span>
      ),
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => deleteMutation.mutateAsync(record.id),
    });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["productList", listQuery],
    queryFn: () => getProductListAPI(listQuery),
  });

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setListQuery((prev) => ({
      ...prev,
      pageNum: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? 10,
    }));
  };

  const handleSearch = () => {
    setListQuery((prev) => ({ ...prev, pageNum: 1 }));
  };

  const columns: ColumnsType<ProductItem> = [
    {
      title: "STT",
      key: "index",
      width: 52,
      render: (_: unknown, __: ProductItem, index: number) =>
        (listQuery.pageNum - 1) * listQuery.pageSize + index + 1,
    },
    {
      title: "Ảnh",
      dataIndex: "thumbnailUrl",
      key: "thumbnailUrl",
      width: 80,
      render: (url: string) =>
        url ? (
          <Image src={url} width={56} height={56} style={{ objectFit: "cover", borderRadius: 6 }} />
        ) : (
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 6,
              background: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#bbb",
              fontSize: 20,
            }}
          >
            ?
          </div>
        ),
    },
    {
      title: "Sản phẩm",
      key: "product",
      render: (record: ProductItem) => (
        <Flex vertical gap={2}>
          <span style={{ fontWeight: 600 }}>{record.name}</span>
          <span style={{ color: "#8c8c8c", fontSize: 12 }}>Mã SP: {record.productCode}</span>
        </Flex>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Thương hiệu",
      dataIndex: "brandName",
      key: "brandName",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) =>
        isActive ? (
          <Tag color="success">Đang bán</Tag>
        ) : (
          <Tag color="default">Ẩn</Tag>
        ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      render: (_: unknown, record: ProductItem) => (
        <Flex gap={8}>
          <Button size="small" type="primary" ghost onClick={() => navigate(`/admin/product/view/${record.id}`)}>
            Xem
          </Button>
          <Button size="small" onClick={() => navigate(`/admin/product/edit/${record.id}`)}>
            Chỉnh sửa
          </Button>
          <Button size="small" danger onClick={() => handleDelete(record)}>
            Xóa
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
          placeholder="Tìm kiếm sản phẩm..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 260 }}
          allowClear
        />
        <Button type="primary" onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </Space>

      {/* operate-container */}
      <Space className="operate-container">
        <Flex gap={8} align="center">
          <AppstoreOutlined style={{ fontSize: 16 }} />
          <Title level={5} style={{ margin: 0 }}>
            Quản lý Sản phẩm
          </Title>
        </Flex>
        <Button type="primary" onClick={() => navigate('/admin/product/add')}>Thêm sản phẩm</Button>
      </Space>

      {/* table-container */}
      <div className="table-container">
        <Table<ProductItem>
          rowKey="id"
          columns={columns}
          dataSource={data?.list ?? []}
          loading={isLoading}
          pagination={{
            current: listQuery.pageNum,
            pageSize: listQuery.pageSize,
            total: data?.total ?? 0,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} sản phẩm`,
          }}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
}