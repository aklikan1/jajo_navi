package jajobackend.controller.database;

import jajobackend.model.ProductsIncome;
import jajobackend.model.TakeProduct;
import jajobackend.repository.PaymentRepository;
import jajobackend.repository.ProductsIncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;

@RestController
@RequestMapping("/api/productsIncome")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductsIncomeController {

    private final ProductsIncomeRepository productsIncomeRepository;
    private final PaymentRepository paymentRepository;

    @Autowired
    public ProductsIncomeController(ProductsIncomeRepository productsIncomeRepository,
                                    PaymentRepository paymentRepository) {
        this.productsIncomeRepository = productsIncomeRepository;
        this.paymentRepository = paymentRepository;
    }

    @GetMapping(path = "emporium/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProductsIncome> getAllProductsIncomeByEmporiumId(@PathVariable Long id) {
        ProductsIncome productsAndIncome = productsIncomeRepository.getByEmporiumId(id);
        //System.out.println(productsAndIncome);
        productsAndIncome.getTakeProducts().sort(Comparator.comparingLong(TakeProduct::getProductHierarchy));
        return ResponseEntity.ok(productsAndIncome);
    }

    public void addIncomeMoneyIzaMoney(TakeProduct takeProduct, Long emporium_id) {
        Long takeProductId = takeProduct.getProductsIncome().getId();
        ProductsIncome productsIncome = productsIncomeRepository.getProductsIncomeById(takeProductId);

        productsIncome.setIncomeMoney(paymentRepository.sumIncomeMoney(emporium_id));

        if (takeProduct.getProductId() != 1) {
            productsIncome.setIzaMoney(paymentRepository.sumMoneyForIza(emporium_id));
        }

        if (productsIncome.getIncomeMoney() == null) {
            productsIncome.setIncomeMoney(0);
        }

        if (productsIncome.getIzaMoney() == null) {
            productsIncome.setIzaMoney(0);
        }

        productsIncomeRepository.save(productsIncome);
    }
}
