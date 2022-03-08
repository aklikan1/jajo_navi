package jajobackend.controller.database;

import jajobackend.service.TakeProductService;
import jajobackend.model.Count;
import jajobackend.model.Payment;
import jajobackend.repository.CountRepository;
import jajobackend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/count")
@CrossOrigin(origins = "http://localhost:4200")
public class CountController {

    private final CountRepository countRepository;
    private final PaymentRepository paymentRepository;
    private final TakeProductService takeProductService;

    @Autowired
    public CountController(CountRepository countRepository, PaymentRepository paymentRepository,
                           TakeProductService takeProductService) {
        this.countRepository = countRepository;
        this.paymentRepository = paymentRepository;
        this.takeProductService = takeProductService;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Count>> getAllCounts() {
        List<Count> count = countRepository.findAll();
        return ResponseEntity.ok(count);
    }

    @GetMapping(path = "emporium/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Count>> getAllCountsByEmporiumId(@PathVariable Long id) {
        List<Count> countByEmporiumId = countRepository.findAllByTransportEmporiumIdOrderByProductHierarchyAsc(id);
        return ResponseEntity.ok(countByEmporiumId);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> saveNewCount(@RequestBody Count count) {

        Count save = countRepository.save(count);

        Long transportId = count.getTransport().getId();
        Long productId = count.getProduct().getId();
        Long emporiumId = save.getTransport().getEmporium().getId();
        Payment payment = paymentRepository.getByTransportId(transportId);

        if (productId == 1) {
            payment.setPaymentEgg(count.getCount()*count.getProduct().getPrice());
            payment.setCostEgg(count.getCount()*count.getProduct().getCost());
        } else {
            payment.setPaymentHoney(count.getCount()*count.getProduct().getPrice());
            payment.setCostHoney(count.getCount()*count.getProduct().getCost());
        }

        paymentRepository.save(payment);
        takeProductService.addTakeProducts(save.getProduct(), emporiumId);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("{id}")
                .buildAndExpand(save.getId())
                .toUri();
        return ResponseEntity.created(location).body(save);
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<?>deleteCountById (@PathVariable Long id) {
        Count count = countRepository.getById(id);

        Long transportId = count.getTransport().getId();
        Long productId = count.getProduct().getId();
        Long emporiumId = count.getTransport().getEmporium().getId();
        Payment payment = paymentRepository.getByTransportId(transportId);

        if (productId == 1) {
            int eggPayment = payment.getPaymentEgg()-(count.getCount()*count.getProduct().getPrice());
            payment.setPaymentEgg(eggPayment);
            int eggCost = payment.getCostEgg()-(count.getCount()*count.getProduct().getCost());
            payment.setCostEgg(eggCost);
        } else {
            int honeyPayment = payment.getPaymentHoney()-(count.getCount()*count.getProduct().getPrice());
            payment.setPaymentHoney(honeyPayment);
            int honeyCost = payment.getCostHoney()-(count.getCount()*count.getProduct().getCost());
            payment.setCostHoney(honeyCost);
        }

        paymentRepository.save(payment);
        countRepository.deleteById(id);

        takeProductService.addTakeProducts(count.getProduct(), emporiumId);

        return ResponseEntity.noContent().build();

    }
}
