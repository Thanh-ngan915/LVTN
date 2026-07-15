package org.example.productservice.service;

import org.example.productservice.dto.CategoryDTO;
import org.example.productservice.dto.OrderStockDTO;
import org.example.productservice.dto.ProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface ProductService {
    Page<ProductDTO> getAllProducts(Pageable pageable);
    Page<ProductDTO> getAllProductsForAdmin(Pageable pageable);
    Page<ProductDTO> getProductsByCategory(String category, Pageable pageable);
    Page<ProductDTO> searchProducts(String keyword, Float minPrice, Float maxPrice, List<String> storeIds, Pageable pageable);
    ProductDTO getProductById(Integer id);
    List<CategoryDTO> getAllCategories();
    Page<ProductDTO> getProductsByStore(String storeId, Pageable pageable);
    Page<ProductDTO> getProductsByStoreAndCategory(String storeId, String category, Pageable pageable);
    Page<ProductDTO> searchProductsByStore(String storeId, String keyword, Pageable pageable);
    ProductDTO createProduct(ProductDTO dto);
    ProductDTO updateProduct(Integer id, ProductDTO dto);
    void deleteProduct(Integer id);
    ProductDTO restockProduct(Integer id, Integer additionalQuantity, String updatedBy);
    ProductDTO restoreProduct(Integer id);
    Page<ProductDTO> getDeletedProductsByStore(String storeId, Pageable pageable);
    Map<String, Object> getProductStats();
    ProductDTO approveProduct(Integer id);
    ProductDTO rejectProduct(Integer id, String reason);
    ProductDTO hideProduct(Integer id);
    void updateStockFromOrder(List<OrderStockDTO> items, boolean isCancel);
}
