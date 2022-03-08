package jajobackend.controller.database;

import jajobackend.model.Message;
import jajobackend.model.Payment;
import jajobackend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:4200")
public class PaymentController {

    private final PaymentRepository paymentRepository;

    @Autowired
    public PaymentController (PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Payment>> getAllPayments() {
        List<Payment> payments = paymentRepository.findAll();
        return ResponseEntity.ok(payments);
    }

    @GetMapping(path = "transport/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Payment> getPaymentByTransportId (@PathVariable Long id) {
        Payment payment = paymentRepository.getByTransportId(id);
        return ResponseEntity.ok(payment);
    }

    @GetMapping(path = "emporium/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Payment>> getAllPaymentsByEmporiumId (@PathVariable Long id) {
        List<Payment> payments = paymentRepository.getAllByTransportEmporiumIdOrderByTransportAddressHierarchyAsc(id);
        payments.forEach(payment -> {
            payment.setTotalPayment(payment.getPaymentEgg() + payment.getPaymentHoney());
            payment.setTotalCost(payment.getCostEgg() + payment.getCostHoney());
        });
        return ResponseEntity.ok(payments);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> saveNewPayment(@RequestBody Payment payment) {
        Payment save = paymentRepository.save(payment);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("{id}")
                .buildAndExpand(save.getId())
                .toUri();
        return ResponseEntity.created(location).body(save);
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<?>deletePaymentById (@PathVariable Long id) {
        paymentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
