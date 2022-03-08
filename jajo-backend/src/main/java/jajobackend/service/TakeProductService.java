package jajobackend.service;

import jajobackend.controller.database.ProductsIncomeController;
import jajobackend.model.Product;
import jajobackend.model.ProductsIncome;
import jajobackend.model.TakeProduct;
import jajobackend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class TakeProductService {

    private final TakeProductRepository takeProductRepository;
    private final ProductsIncomeRepository productsIncomeRepository;
    private final CountRepository countRepository;
    private final ProductsIncomeController productsIncomeController;

    @Autowired
    public TakeProductService(TakeProductRepository takeProductRepository,
                              ProductsIncomeRepository productsIncomeRepository,
                              ProductsIncomeController productsIncomeController,
                              CountRepository countRepository) {
        this.takeProductRepository = takeProductRepository;
        this.productsIncomeRepository = productsIncomeRepository;
        this.productsIncomeController = productsIncomeController;
        this.countRepository = countRepository;
    }

    public void addTakeProducts(Product product, Long emporiumId) {

        Long productId = product.getId();
        ProductsIncome productsIncome = productsIncomeRepository.getByEmporiumId(emporiumId);

        if (!takeProductRepository.existsTakeProductByProductIdAndProductsIncomeEmporiumId(productId, emporiumId)) {
            TakeProduct takeProductTemp = new TakeProduct();
            takeProductTemp.setProductId(productId);
            takeProductTemp.setProductName(product.getName());
            takeProductTemp.setProductCount(0);
            takeProductTemp.setProductHierarchy(product.getHierarchy());
            takeProductTemp.setLiquid(0);
            takeProductTemp.setProductsIncome(productsIncome);

            takeProductRepository.save(takeProductTemp);
        }

        TakeProduct takeProduct =
                takeProductRepository.getTakeProductByProductIdAndProductsIncomeEmporiumIdOrderByProductHierarchyAsc(productId, emporiumId);

        Integer sumCount = countRepository.sumCountByProductIdAndEmporiumId(productId, emporiumId);
        takeProduct.setProductCount(sumCount);

        if (productId != 1) {
            Integer sumCountLiquid = countRepository.sumLiquidByProductIdAndEmporiumId(productId, emporiumId);
            takeProduct.setLiquid(sumCountLiquid);
        }

        TakeProduct save = takeProductRepository.save(takeProduct);

        if (save.getProductCount() == null) {
            takeProductRepository.deleteById(save.getId());
        }

        productsIncomeController.addIncomeMoneyIzaMoney(save, emporiumId);
    }
}
