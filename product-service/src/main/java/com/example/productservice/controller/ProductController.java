package com.example.productservice.controller;

import com.example.productservice.dto.ProductRequestDTO;
import com.example.productservice.model.Product;
import com.example.productservice.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // API để thêm sản phẩm mới kèm biến thể
    @PostMapping("/add")
    public ResponseEntity<?> addProduct(@RequestBody ProductRequestDTO productRequest) {
        try {
            Product savedProduct = productService.saveProduct(productRequest);
            return ResponseEntity.ok("Thêm sản phẩm thành công! ID: " + savedProduct.getId());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi rồi: " + e.getMessage());
        }
    }
}
