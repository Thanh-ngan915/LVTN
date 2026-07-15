package org.example.productservice.repository;

import jakarta.persistence.criteria.Predicate;
import org.example.productservice.model.Product;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {

    /**
     * Build a JPA Specification for searching products with optional filters:
     * - keyword  : matched against product name (case-insensitive LIKE)
     * - minPrice : minimum priceAfter (inclusive)
     * - maxPrice : maximum priceAfter (inclusive)
     * - storeIds : list of storeId values to restrict results to
     *
     * Only active (status = 'active') and non-deleted (isDelete = false / null)
     * products are included regardless of the other filters.
     */
    public static Specification<Product> searchWithFilters(
            String keyword,
            Float minPrice,
            Float maxPrice,
            List<String> storeIds
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Always exclude deleted / inactive products
            predicates.add(
                cb.or(
                    cb.isFalse(root.get("isDelete")),
                    cb.isNull(root.get("isDelete"))
                )
            );
            predicates.add(cb.equal(root.get("status"), "active"));

            // Keyword filter (name LIKE %keyword%)
            if (keyword != null && !keyword.isBlank()) {
                predicates.add(
                    cb.like(cb.lower(root.get("name")), "%" + keyword.toLowerCase() + "%")
                );
            }

            // Price range filters (priceAfter)
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("priceAfter"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("priceAfter"), maxPrice));
            }

            // Location / store filter
            if (storeIds != null && !storeIds.isEmpty()) {
                predicates.add(root.get("storeId").in(storeIds));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
