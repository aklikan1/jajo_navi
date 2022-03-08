package jajobackend.repository;

import jajobackend.model.TakeProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TakeProductRepository extends JpaRepository <TakeProduct, Long> {
    boolean existsTakeProductByProductIdAndProductsIncomeEmporiumId (Long productId, Long emporiumId);
    TakeProduct getTakeProductByProductIdAndProductsIncomeEmporiumIdOrderByProductHierarchyAsc(Long productId, Long emporiumId);
}
