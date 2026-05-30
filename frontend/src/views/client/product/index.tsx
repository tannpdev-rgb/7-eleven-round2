import { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Breadcrumb, Checkbox, Row, Col, Select, Pagination, Spin, Drawer, Button } from 'antd';
import { FilterOutlined, AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '@/components/client/ProductCard';
import { getClientProductListAPI } from '@/apis/product';
import { getClientCategoriesAPI } from '@/apis/category';

export default function ProductClient() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search') || undefined;
  
  const [pageNum, setPageNum] = useState(1);
  const [mobileFilterVisible, setMobileFilterVisible] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getClientCategoriesAPI,
  });

  const { data: productData, isLoading } = useQuery({
    queryKey: ['products', pageNum, slug, searchKeyword],
    queryFn: () => getClientProductListAPI({ pageNum, pageSize: 12, categorySlug: slug, keyword: searchKeyword }),
  });

  const currentCategory = categories?.find(c => c.slug === slug);
  const breadcrumbName = searchKeyword 
    ? `Tìm kiếm: "${searchKeyword}"` 
    : (currentCategory ? currentCategory.name : 'Tất cả sản phẩm');

  const renderSidebar = () => (
    <div className="category-sidebar">
      <div className="category-filter-section">
        <div className="category-filter-title">Danh mục</div>
        <div className="flex-center gap-12" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <Checkbox checked={!slug}>
            <Link to="/category" style={{ color: 'inherit' }}>Tất cả</Link>
          </Checkbox>
          {categories?.filter(c => c.parentId == null || c.parentId === 0).map(cat => (
            <Checkbox key={cat.id} checked={slug === cat.slug}>
              <Link to={`/category/${cat.slug}`} style={{ color: 'inherit' }}>{cat.name}</Link>
            </Checkbox>
          ))}
        </div>
      </div>
      
    </div>
  );

  return (
    <div className="client-container page-container">
      <Breadcrumb
        items={[
          { title: <Link to="/">Trang chủ</Link> },
          { title: breadcrumbName },
        ]}
        className="mb-24"
      />

      {/* Title & Mobile Actions */}
      <div className="page-title-row">
        <h1 className="page-title">{breadcrumbName}</h1>
        
        <div className="mobile-only">
          <Button icon={<FilterOutlined />} onClick={() => setMobileFilterVisible(true)}>
            Bộ lọc
          </Button>
        </div>
      </div>

      <Row gutter={24}>
        {/* Sidebar (Desktop) */}
        <Col xs={0} sm={0} md={6} lg={5}>
          {renderSidebar()}
        </Col>

        {/* Content */}
        <Col xs={24} sm={24} md={18} lg={19}>
          <div className="category-toolbar">
            <span className="text-secondary">
              {productData?.total || 0} sản phẩm
            </span>
            <div className="flex-center gap-16">
              <div className="flex-center gap-8">
                Sắp xếp: 
                <Select defaultValue="popular" style={{ width: 140 }}>
                  <Select.Option value="popular">Phổ biến</Select.Option>
                  <Select.Option value="priceAsc">Giá thấp đến cao</Select.Option>
                  <Select.Option value="priceDesc">Giá cao đến thấp</Select.Option>
                </Select>
              </div>
              <div className="flex-center gap-8 text-secondary">
                <AppstoreOutlined className="text-primary" style={{ fontSize: '20px' }} />
                <BarsOutlined style={{ fontSize: '20px' }} />
              </div>
            </div>
          </div>

          <Spin spinning={isLoading}>
            <Row gutter={[16, 16]}>
              {productData?.list?.map((product) => (
                <Col xs={12} sm={12} md={8} lg={6} key={product.id}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>

            {productData?.list?.length === 0 && (
              <div className="text-center text-secondary mt-24" style={{ padding: '48px 0' }}>
                Không tìm thấy sản phẩm nào
              </div>
            )}
          </Spin>

          {productData && productData.totalPage > 0 && (
            <div className="flex-center" style={{ justifyContent: 'center', marginTop: '40px' }}>
              <Pagination 
                current={pageNum} 
                total={productData.totalPage} 
                pageSize={12}
                onChange={(page) => setPageNum(page)}
                showSizeChanger={false}
              />
            </div>
          )}
        </Col>
      </Row>

      <Drawer
        title="Bộ lọc"
        placement="left"
        onClose={() => setMobileFilterVisible(false)}
        open={mobileFilterVisible}
        width={300}
      >
        {renderSidebar()}
      </Drawer>
    </div>
  );
}