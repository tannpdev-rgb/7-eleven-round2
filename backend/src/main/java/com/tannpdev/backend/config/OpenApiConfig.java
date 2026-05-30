package com.tannpdev.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("E-Commerce Backend API")
                        .description("Tài liệu tích hợp API cho hệ thống Thương mại điện tử (Phân hệ Sản phẩm & Đơn hàng)")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Tannpdev Support")
                                .email("support@tannpdev.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")));
    }

    /**
     * Cấu hình Nhóm API phiên bản v1
     */
    @Bean
    public GroupedOpenApi v1Api() {
        return GroupedOpenApi.builder()
                .group("API Version 1")
                .pathsToMatch("/api/v1/**")
                .packagesToScan("com.tannpdev.backend.controller.v1")
                .build();
    }

    /**
     * Cấu hình Nhóm API phiên bản v2
     */
    @Bean
    public GroupedOpenApi v2Api() {
        return GroupedOpenApi.builder()
                .group("API Version 2")
                .pathsToMatch("/api/v2/**")
                .packagesToScan("com.tannpdev.backend.controller.v2")
                .build();
    }
}
