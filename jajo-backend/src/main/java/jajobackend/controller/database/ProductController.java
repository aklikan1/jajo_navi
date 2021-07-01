package jajobackend.controller.database;

import jajobackend.model.Product;
import jajobackend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {

    private final ProductRepository productRepository;

    @Autowired
    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity <List<Product>> getAllProducts() {
        List<Product> products = productRepository.findAllByOrderByHierarchyAsc();
        return ResponseEntity.ok(products);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> saveNewProduct(@RequestBody Product product) {
        Product save = productRepository.save(product);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("{id}")
                .buildAndExpand(save.getId())
                .toUri();
        return ResponseEntity.created(location).body(save);
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<?>deleteAddressById (@PathVariable Long id) {
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
