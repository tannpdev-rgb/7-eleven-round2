package com.tannpdev.backend.service;

import com.tannpdev.backend.dto.client.ClientCategoryResult;
import com.tannpdev.backend.mbg.model.Category;

import java.util.List;

public interface CategoryService {
    List<Category> listAll();
    
    List<ClientCategoryResult> listForClient();
}
