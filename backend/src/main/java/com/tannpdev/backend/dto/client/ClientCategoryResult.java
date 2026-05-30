package com.tannpdev.backend.dto.client;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class ClientCategoryResult {
    private Long id;
    private String name;
    private String slug;
    private Long parentId;
    private String description;
    private String imageUrl;
}
