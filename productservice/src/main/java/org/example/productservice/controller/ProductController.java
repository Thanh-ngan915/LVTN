package org.example.productservice.controller;

import org.example.productservice.client.StoreClient;
import org.example.productservice.dto.ApiResponse;
import org.example.productservice.dto.CategoryDTO;
import org.example.productservice.dto.ProductDTO;
import org.example.productservice.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final StoreClient storeClient;

    /**
     * Lấy tất cả sản phẩm (phân trang)
     * GET /api/products?page=0&size=12&sort=createdAt,desc
     */
    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ProductDTO> productPage = productService.getAllProducts(pageable);

        ApiResponse<List<ProductDTO>> response = ApiResponse.<List<ProductDTO>>builder()
                .success(true)
                .message("Products retrieved successfully")
                .data(productPage.getContent())
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * Lấy tất cả sản phẩm (cho admin dashboard)
     * GET /api/admin/products?page=0&size=12
     */
    @GetMapping("/admin/products")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getAdminAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ProductDTO> productPage = productService.getAdminAllProducts(pageable);

        ApiResponse<List<ProductDTO>> response = ApiResponse.<List<ProductDTO>>builder()
                .success(true)
                .message("All products retrieved successfully")
                .data(productPage.getContent())
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * Lấy sản phẩm theo ID
     * GET /api/products/{id}
     */
    @GetMapping("/products/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> getProductById(@PathVariable Integer id) {
        try {
            ProductDTO product = productService.getProductById(id);
            return ResponseEntity.ok(ApiResponse.success(product, "Product found"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Lấy sản phẩm theo category
     * GET /api/products/category/{category}?page=0&size=12
     */
    @GetMapping("/products/category/{category}")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getProductsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ProductDTO> productPage = productService.getProductsByCategory(category, pageable);

        ApiResponse<List<ProductDTO>> response = ApiResponse.<List<ProductDTO>>builder()
                .success(true)
                .message("Products by category retrieved successfully")
                .data(productPage.getContent())
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * Tìm kiếm sản phẩm theo tên
     * GET /api/products/search?keyword=abc&page=0&size=12
     */
    @GetMapping("/products/search")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDTO> productPage = productService.searchProducts(keyword, pageable);

        ApiResponse<List<ProductDTO>> response = ApiResponse.<List<ProductDTO>>builder()
                .success(true)
                .message("Search results")
                .data(productPage.getContent())
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * Lấy sản phẩm theo shop
     * GET /api/products/store/{storeId}?page=0&size=12
     */
    @GetMapping("/products/store/{storeId}")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getProductsByStore(
            @PathVariable String storeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ProductDTO> productPage = productService.getProductsByStore(storeId, pageable);

        ApiResponse<List<ProductDTO>> response = ApiResponse.<List<ProductDTO>>builder()
                .success(true)
                .message("Products by store retrieved successfully")
                .data(productPage.getContent())
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * Lấy tất cả sản phẩm của shop (cho dashboard quản lý)
     * GET /api/products/store/{storeId}/manage?page=0&size=12
     */
    @GetMapping("/products/store/{storeId}/manage")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getManageProductsByStore(
            @PathVariable String storeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ProductDTO> productPage = productService.getManageProductsByStore(storeId, pageable);

        ApiResponse<List<ProductDTO>> response = ApiResponse.<List<ProductDTO>>builder()
                .success(true)
                .message("Products for management retrieved successfully")
                .data(productPage.getContent())
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * Lấy sản phẩm theo shop và category
     * GET /api/products/store/{storeId}/category/{category}?page=0&size=12
     */
    @GetMapping("/products/store/{storeId}/category/{category}")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getProductsByStoreAndCategory(
            @PathVariable String storeId,
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ProductDTO> productPage = productService.getProductsByStoreAndCategory(storeId, category, pageable);

        ApiResponse<List<ProductDTO>> response = ApiResponse.<List<ProductDTO>>builder()
                .success(true)
                .message("Products by store and category retrieved successfully")
                .data(productPage.getContent())
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * Tìm kiếm sản phẩm trong shop
     * GET /api/products/store/{storeId}/search?keyword=abc&page=0&size=12
     */
    @GetMapping("/products/store/{storeId}/search")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> searchProductsByStore(
            @PathVariable String storeId,
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDTO> productPage = productService.searchProductsByStore(storeId, keyword, pageable);

        ApiResponse<List<ProductDTO>> response = ApiResponse.<List<ProductDTO>>builder()
                .success(true)
                .message("Search results in store")
                .data(productPage.getContent())
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * Lấy tất cả categories
     * GET /api/categories
     */
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getAllCategories() {
        List<CategoryDTO> categories = productService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success(categories, "Categories retrieved successfully"));
    }

    /**
     * Tạo sản phẩm mới: POST /api/products
     * Tự động đồng bộ storeId từ Access Token:
     *   1. Đọc userId từ JWT (qua JwtTokenFilter -> request attribute)
     *   2. Gọi store-service lấy storeId của user đó
     *   3. Gán storeId vào sản phẩm trước khi lưu
     */
    @PostMapping("/products")
    public ResponseEntity<ApiResponse<ProductDTO>> createProduct(
            @RequestBody ProductDTO productDTO,
            HttpServletRequest request) {
        try {
            // Lấy userId từ JWT token (đã được set bởi JwtTokenFilter)
            String userId = (String) request.getAttribute("userId");
            if (!StringUtils.hasText(userId)) {
                return ResponseEntity.status(401).body(ApiResponse.error("Vui lòng đăng nhập"));
            }

            // Lấy Bearer token gốc để truyền sang store-service
            String bearerToken = request.getHeader("Authorization");

            // Gọi store-service lấy storeId theo userId từ token
            String storeId = storeClient.getStoreIdByUserId(userId, bearerToken);
            if (!StringUtils.hasText(storeId)) {
                return ResponseEntity.status(403).body(
                    ApiResponse.error("Bạn chưa có shop. Vui lòng đăng ký shop trước khi đăng sản phẩm.")
                );
            }

            // Tự động gán storeId và createdBy từ token
            productDTO.setStoreId(storeId);
            productDTO.setCreatedBy(userId);

            ProductDTO created = productService.createProduct(productDTO);
            return ResponseEntity.ok(ApiResponse.success(created, "Tạo sản phẩm thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    //Cập nhật sản phẩm: PUT /api/products/{id}
    @PutMapping("/products/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> updateProduct(
            @PathVariable Integer id,
            @RequestBody ProductDTO productDTO) {
        try {
            ProductDTO updated = productService.updateProduct(id, productDTO);
            return ResponseEntity.ok(ApiResponse.success(updated, "Product updated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    //Xóa sản phẩm: DELETE /api/products/{id}
    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> deleteProduct(@PathVariable Integer id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Product deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // restock spham: PUT /api/product/{id}/restock
    @PutMapping("/products/{id}/restock")
    public ResponseEntity<ApiResponse<ProductDTO>> restockProduct(
            @PathVariable Integer id,
            @RequestParam Integer quantity,
            @RequestParam(required = false) String updatedBy) {
        try {
            ProductDTO result = productService.restockProduct(id, quantity, updatedBy);
            return ResponseEntity.ok(ApiResponse.success(result, "Restock successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    //restore spham đã xóa
    @PutMapping("/products/{id}/restore")
    public ResponseEntity<ApiResponse<ProductDTO>> restoreProduct(@PathVariable Integer id) {
        try {
            ProductDTO restored = productService.restoreProduct(id);
            return ResponseEntity.ok(ApiResponse.success(restored, "Product restored successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/products/store/{storeId}/deleted")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getDeletedProductsByStore(
            @PathVariable String storeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDTO> productPage = productService.getDeletedProductsByStore(storeId, pageable);
        ApiResponse<List<ProductDTO>> response = ApiResponse.<List<ProductDTO>>builder()
                .success(true)
                .message("Deleted products retrieved successfully")
                .data(productPage.getContent())
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/products/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProductStats() {
        try {
            Map<String, Object> stats = productService.getProductStats();
            return ResponseEntity.ok(ApiResponse.success(stats, "Stats retrieved"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/products/{id}/approve")
    public ResponseEntity<ApiResponse<ProductDTO>> approveProduct(
            @PathVariable Integer id,
            HttpServletRequest request) {
        try {
            // Kiểm tra quyền admin
            String userRole = (String) request.getAttribute("userRole");
            if (!"admin".equalsIgnoreCase(userRole)) {
                return ResponseEntity.status(403).body(
                        ApiResponse.error("Chỉ admin mới có thể duyệt sản phẩm")
                );
            }

            ProductDTO approved = productService.approveProduct(id);
            return ResponseEntity.ok(ApiResponse.success(approved, "Sản phẩm được duyệt"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/products/{id}/reject")
    public ResponseEntity<ApiResponse<ProductDTO>> rejectProduct(
            @PathVariable Integer id,
            @RequestParam(required = false) String reason,
            HttpServletRequest request) {
        try {
            String userRole = (String) request.getAttribute("userRole");
            if (!"admin".equalsIgnoreCase(userRole)) {
                return ResponseEntity.status(403).body(
                        ApiResponse.error("Chỉ admin mới có thể từ chối sản phẩm")
                );
            }

            ProductDTO rejected = productService.rejectProduct(id, reason);
            return ResponseEntity.ok(ApiResponse.success(rejected, "Sản phẩm bị từ chối"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/products/{id}/hide")
    public ResponseEntity<ApiResponse<ProductDTO>> hideProduct(
            @PathVariable Integer id,
            HttpServletRequest request) {
        try {
            String userRole = (String) request.getAttribute("userRole");
            if (!"admin".equalsIgnoreCase(userRole)) {
                return ResponseEntity.status(403).body(
                        ApiResponse.error("Chỉ admin mới có thể ẩn sản phẩm")
                );
            }

            ProductDTO hidden = productService.hideProduct(id);
            return ResponseEntity.ok(ApiResponse.success(hidden, "Sản phẩm được ẩn"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

}
