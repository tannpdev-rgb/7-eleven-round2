package com.tannpdev.backend.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

@Data
@EqualsAndHashCode
public class ProductImageResult {
    private Long id;

    private Long productId;

    private String imageUrl;

    private Boolean isThumbnail;

    private Integer displayOrder;

    private Date createdAt;

    private Date updatedAt;

    private Long createdBy;

    private Long updatedBy;

    private Boolean isDeleted;
}
