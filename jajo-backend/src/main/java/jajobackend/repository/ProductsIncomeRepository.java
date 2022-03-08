package jajobackend.repository;

import jajobackend.model.ProductsIncome;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductsIncomeRepository extends JpaRepository<ProductsIncome, Long> {
    ProductsIncome getProductsIncomeById(Long id);
    ProductsIncome getByEmporiumId(Long id);
    boolean existsProductsIncomeByEmporiumId(Long id);
}
