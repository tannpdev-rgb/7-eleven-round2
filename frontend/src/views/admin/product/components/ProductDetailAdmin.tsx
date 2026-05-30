import { AppstoreOutlined, PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, InputNumber, Row, Select, Space, Steps, Switch, Upload, message, Radio, Flex } from "antd";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAllCategoriesAPI } from "@/apis/category";
import { getAllBrandsAPI } from "@/apis/brand";
import { createProductAPI, checkSkuAPI } from "@/apis/product";
import type { ProductParam } from "@/types/product";
import type { UploadProps } from "antd";

const { TextArea } = Input;

function generateRandomString(length: number) {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
}

function slugifyString(str: string) {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .toUpperCase();
}

type Props = {
  isEdit?: boolean;
};

export default function ProductDetailAdmin({ isEdit = false }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasVariants, setHasVariants] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategoriesAPI,
  });

  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrandsAPI,
  });

  const createMutation = useMutation({
    mutationFn: createProductAPI,
    onSuccess: () => {
      message.success("Tạo sản phẩm thành công!");
      navigate("/admin/product");
    },
  });

  // Dummy upload request
  const customUploadRequest: UploadProps["customRequest"] = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess?.("ok");
    }, 500);
  };

  const normalizeUpload = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const next = async () => {
    try {
      // Validate fields of the current step
      if (currentStep === 0) {
        await form.validateFields(["name", "productCode", "shortDescription", "description", "categoryId", "brandId", "isActive"]);
        if (!hasVariants) {
          await form.validateFields(["price", "stockQuantity"]);
        }
      } else if (currentStep === 1) {
        await form.validateFields(["productImageList"]);
      }
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleAutoGenerateSku = () => {
    const name = form.getFieldValue("name");
    let generatedSku = "";
    if (name) {
      generatedSku = slugifyString(name) + "-" + generateRandomString(4);
    } else {
      generatedSku = "SP-" + generateRandomString(6);
    }
    form.setFieldsValue({ productCode: generatedSku });
    form.validateFields(["productCode"]);
  };

  const onFinish = (values: any) => {
    // Format values to match ProductParam
    const payload: ProductParam = {
      name: values.name,
      productCode: values.productCode,
      shortDescription: values.shortDescription,
      description: values.description,
      isActive: values.isActive ?? true,
      categoryId: values.categoryId,
      brandId: values.brandId,
      productImageList: values.productImageList?.map((img: any, index: number) => {
         // handle url from dummy upload
         const url = img.url || img.response?.url || "https://dummyimage.com/600x400/000/fff";
         return {
           imageUrl: url,
           isThumbnail: values.thumbnailIndex === index,
           displayOrder: index,
         }
      }) || [],
      productVariantList: hasVariants ? (values.productVariantList || []) : [],
      price: !hasVariants ? values.price : undefined,
      salePrice: !hasVariants ? values.salePrice : undefined,
      stockQuantity: !hasVariants ? values.stockQuantity : undefined,
      defaultVariantIndex: hasVariants ? values.defaultVariantIndex : undefined,
    };

    if (payload.productImageList.length > 0 && values.thumbnailIndex === undefined) {
       payload.productImageList[0].isThumbnail = true;
    }

    if (isEdit) {
      // call update api...
    } else {
      createMutation.mutate(payload);
    }
  };

  const steps = [
    { title: "Thông tin chung" },
    { title: "Hình ảnh" },
  ];
  if (hasVariants) {
    steps.push({ title: "Thuộc tính sản phẩm" });
  }

  return (
    <div>
      <Space className="operate-container" style={{ width: '100%' }}>
        <Flex gap={8} align="center">
          <AppstoreOutlined style={{ fontSize: 16 }} />
          <Title level={5} style={{ margin: 0 }}>
            {isEdit ? "Cập nhật Sản phẩm" : "Thêm mới Sản phẩm"}
          </Title>
        </Flex>
        <Button onClick={() => navigate("/admin/product")}>Quay lại</Button>
      </Space>

      <Card>
        <Steps current={currentStep} items={steps} style={{ marginBottom: 40 }} />

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ isActive: true, productImageList: [], productVariantList: [], hasVariants: false }}
          onValuesChange={(changedValues) => {
            if (changedValues.hasVariants !== undefined) {
              setHasVariants(changedValues.hasVariants);
            }
          }}
        >
          {/* STEP 0: Thông tin chung */}
          <div style={{ display: currentStep === 0 ? "block" : "none" }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}>
                  <Input placeholder="Ví dụ: Cà phê sữa đá" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="productCode" label="Mã sản phẩm" rules={[
                  { required: true, message: "Vui lòng nhập mã sản phẩm" },
                  {
                    validator: async (_, value) => {
                      if (!value) return Promise.resolve();
                      const exists = await checkSkuAPI(value);
                      if (exists) {
                        return Promise.reject(new Error("Mã sản phẩm này đã tồn tại"));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}>
                  <Input placeholder="Ví dụ: CF-SUA-DA" addonAfter={<Button type="text" size="small" onClick={handleAutoGenerateSku}>Tạo tự động</Button>} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}>
                  <Select placeholder="Chọn danh mục">
                    {categories?.map((cat) => (
                      <Select.Option key={cat.id} value={cat.id}>
                        {cat.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="brandId" label="Thương hiệu" rules={[{ required: true, message: "Vui lòng chọn thương hiệu" }]}>
                  <Select placeholder="Chọn thương hiệu">
                    {brands?.map((brand) => (
                      <Select.Option key={brand.id} value={brand.id}>
                        {brand.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="shortDescription" label="Mô tả ngắn" rules={[{ required: true, message: "Vui lòng nhập mô tả ngắn" }]}>
                  <TextArea rows={2} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="description" label="Mô tả chi tiết" rules={[{ required: true, message: "Vui lòng nhập mô tả chi tiết" }]}>
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="isActive" label="Trạng thái" valuePropName="checked">
                  <Switch checkedChildren="Đang bán" unCheckedChildren="Ẩn" />
                </Form.Item>
              </Col>
              
              <Col span={24}>
                <Form.Item name="hasVariants" label="Sản phẩm có biến thể?" valuePropName="checked">
                  <Switch checkedChildren="Có" unCheckedChildren="Không" />
                </Form.Item>
              </Col>
              
              {!hasVariants && (
                <>
                  <Col span={8}>
                    <Form.Item name="price" label="Giá bán (VNĐ)" rules={[{ required: true, message: "Vui lòng nhập giá bán" }]}>
                      <InputNumber style={{ width: "100%" }} min={0} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="salePrice" label="Giá khuyến mãi">
                      <InputNumber style={{ width: "100%" }} min={0} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="stockQuantity" label="Số lượng tồn kho" rules={[{ required: true, message: "Vui lòng nhập tồn kho" }]}>
                      <InputNumber style={{ width: "100%" }} min={0} />
                    </Form.Item>
                  </Col>
                </>
              )}
            </Row>
          </div>

          {/* STEP 1: Hình ảnh */}
          <div style={{ display: currentStep === 1 ? "block" : "none" }}>
            <Form.Item
              name="productImageList"
              label="Danh sách hình ảnh"
              valuePropName="fileList"
              getValueFromEvent={normalizeUpload}
            >
              <Upload
                listType="picture-card"
                customRequest={customUploadRequest}
                accept="image/*"
                multiple
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item noStyle dependencies={["productImageList"]}>
              {({ getFieldValue }) => {
                const imgList = getFieldValue("productImageList") || [];
                if (imgList.length === 0) return null;
                return (
                  <Form.Item name="thumbnailIndex" label="Chọn ảnh đại diện" initialValue={0}>
                    <Radio.Group>
                      <Space direction="vertical">
                        {imgList.map((file: any, index: number) => (
                          <Radio key={file.uid || index} value={index}>
                            Ảnh {index + 1} {file.name && `(${file.name})`}
                          </Radio>
                        ))}
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                );
              }}
            </Form.Item>
          </div>

          {/* STEP 2: Biến thể */}
          {hasVariants && (
            <div style={{ display: currentStep === 2 ? "block" : "none" }}>
              <Form.Item name="defaultVariantIndex" label="Chọn biến thể mặc định (giá trị sẽ đại diện cho sản phẩm)" initialValue={0}>
                <Radio.Group style={{ width: '100%' }}>
                  <Form.List name="productVariantList">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }, index) => (
                          <Card size="small" key={key} style={{ marginBottom: 16 }} 
                                title={<Radio value={index}> Đặt làm mặc định</Radio>}
                                extra={<MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red' }} />}>
                            <Row gutter={16}>
                              <Col span={8}>
                                <Form.Item {...restField} name={[name, "sku"]} label="SKU Con" rules={[
                                  { required: true, message: "Nhập SKU con" },
                                  {
                                    validator: async (_, value) => {
                                      if (!value) return Promise.resolve();
                                      const exists = await checkSkuAPI(value);
                                      if (exists) {
                                        return Promise.reject(new Error("Mã SKU này đã tồn tại"));
                                      }
                                      return Promise.resolve();
                                    }
                                  }
                                ]}>
                                  <Input placeholder="CF-SUA-DA-S" />
                                </Form.Item>
                              </Col>
                              <Col span={16}>
                                <Form.Item {...restField} name={[name, "title"]} label="Tên phân loại" rules={[{ required: true, message: "Nhập tên phân loại" }]}>
                                  <Input placeholder="Size S" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item {...restField} name={[name, "price"]} label="Giá gốc (VNĐ)" rules={[{ required: true, message: "Nhập giá" }]}>
                                  <InputNumber style={{ width: "100%" }} min={0} />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item {...restField} name={[name, "salePrice"]} label="Giá khuyến mãi">
                                  <InputNumber style={{ width: "100%" }} min={0} />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item {...restField} name={[name, "stockQuantity"]} label="Tồn kho" rules={[{ required: true, message: "Nhập tồn kho" }]}>
                                  <InputNumber style={{ width: "100%" }} min={0} />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Card>
                        ))}
                        <Form.Item>
                          <Button type="dashed" onClick={() => {
                            const parentSku = form.getFieldValue("productCode");
                            const variants = form.getFieldValue("productVariantList") || [];
                            const newSku = parentSku ? `${parentSku}-${variants.length + 1}` : "";
                            add({ sku: newSku });
                          }} block icon={<PlusOutlined />}>
                            Thêm biến thể
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Radio.Group>
              </Form.Item>
            </div>
          )}

          <div style={{ marginTop: 24, textAlign: "right" }}>
            {currentStep > 0 && (
              <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
                Quay lại
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Tiếp tục
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="primary" htmlType="submit" loading={createMutation.isPending}>
                Hoàn tất
              </Button>
            )}
          </div>
        </Form>
      </Card>
    </div>
  );
}