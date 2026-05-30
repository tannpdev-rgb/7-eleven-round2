package com.tannpdev.backend.dto.client;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class ClientProductQueryParam {
    private String categorySlug;
    private Long categoryId;
    private Long brandId;
    private String keyword;
}
