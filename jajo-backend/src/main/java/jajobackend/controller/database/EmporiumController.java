package jajobackend.controller.database;

import jajobackend.model.Emporium;
import jajobackend.model.ProductsIncome;
import jajobackend.model.TakeProduct;
import jajobackend.repository.EmporiumRepository;
import jajobackend.repository.ProductsIncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/emporium")
@CrossOrigin(origins = "http://localhost:4200")
public class EmporiumController {

    private final EmporiumRepository emporiumRepository;
    private final ProductsIncomeRepository productsIncomeRepository;

    @Autowired
    public EmporiumController(EmporiumRepository emporiumRepository, ProductsIncomeRepository productsIncomeRepository) {
        this.emporiumRepository = emporiumRepository;
        this.productsIncomeRepository = productsIncomeRepository;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Emporium>> getAllEmporiums() {
        List<Emporium> emporiums = emporiumRepository.findAllByOrderByIdDesc();
        return ResponseEntity.ok(emporiums);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> saveNewEmporium(@RequestBody Emporium emporium) {

        if (!productsIncomeRepository.existsProductsIncomeByEmporiumId(emporium.getId())) {
            ProductsIncome productsAndIncome = new ProductsIncome();
            productsAndIncome.setIncomeMoney(0);
            productsAndIncome.setIzaMoney(0);
            productsAndIncome.setEmporium(emporium);
            productsAndIncome.setTakeProducts(new ArrayList<>());
            ProductsIncome temp = productsIncomeRepository.save(productsAndIncome);
            emporium.setProductsIncome(temp);
        }

        Emporium save = emporiumRepository.save(emporium);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("{id}")
                .buildAndExpand(save.getId())
                .toUri();
        return ResponseEntity.created(location).body(save);
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<?>deleteEmporiumById (@PathVariable Long id) {
        emporiumRepository.deleteById(id);
        return ResponseEntity.noContent().build();

    }
}
