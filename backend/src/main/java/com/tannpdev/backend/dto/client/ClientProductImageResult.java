package com.tannpdev.backend.dto.client;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class ClientProductImageResult {
    private Long id;
    private String imageUrl;
    private Boolean isThumbnail;
    private Integer displayOrder;
}
