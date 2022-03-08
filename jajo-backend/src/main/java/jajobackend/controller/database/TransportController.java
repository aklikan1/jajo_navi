package jajobackend.controller.database;

import jajobackend.model.Count;
import jajobackend.model.Payment;
import jajobackend.model.Product;
import jajobackend.model.Transport;
import jajobackend.repository.CountRepository;
import jajobackend.repository.PaymentRepository;
import jajobackend.repository.ProductRepository;
import jajobackend.repository.TransportRepository;
import jajobackend.service.TakeProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.sql.Time;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/transport")
@CrossOrigin(origins = "http://localhost:4200")
public class TransportController {

    private final TransportRepository transportRepository;
    private final CountRepository countRepository;
    private final ProductRepository productRepository;
    private final PaymentRepository paymentRepository;

    private final TakeProductService takeProductService;

    @Autowired
    public TransportController(TransportRepository transportRepository, CountRepository countRepository,
                               ProductRepository productRepository, PaymentRepository paymentRepository,
                               TakeProductService takeProductService) {
        this.transportRepository = transportRepository;
        this.countRepository = countRepository;
        this.productRepository = productRepository;
        this.paymentRepository = paymentRepository;
        this.takeProductService = takeProductService;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Transport>> getAllTransports() {
        List<Transport> transport = transportRepository.findAllByOrderByAddressHierarchyAsc();
        return ResponseEntity.ok(transport);
    }

    @GetMapping(path = "emporium/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Transport>> getTransportsByEmporiumId(@PathVariable Long id) {

        List<Transport> transports = transportRepository.findAllByEmporiumIdOrderByAddressHierarchyAsc(id);
        transports.forEach(e -> {
            List<Product> tempActualProduct = new ArrayList<>();

            e.setAvailableProducts(productRepository.findAllByOrderByHierarchyAsc());
            List<Count> countsByEmporiumIdAndTransportId =
                    countRepository.findAllByTransportIdAndTransportEmporiumIdOrderByProductHierarchyAsc(e.getId(), id);
            countsByEmporiumIdAndTransportId.forEach( x -> {
                tempActualProduct.add(x.getProduct());
                e.getAvailableProducts().removeIf(obj -> obj.getId().equals(x.getProduct().getId()));
            });

            e.setActualProducts(tempActualProduct);
        });

        return ResponseEntity.ok(transports);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> saveNewTransport(@RequestBody Transport transport) {

        if (transport.getTime() == null) {
            Calendar cal = Calendar.getInstance();
            cal.set(Calendar.HOUR_OF_DAY, 0);
            cal.set(Calendar.MINUTE, 0);
            cal.set(Calendar.SECOND, 0);
            cal.set(Calendar.MILLISECOND, 0);
            Date zeroedDate = cal.getTime();

            Time time = new Time(zeroedDate.getTime());

            transport.setTime(time);
        }

        if (transport.getIsSent() == null) {
            transport.setIsSent(false);
        }

        if (transport.getIsPaid() == null) {
            transport.setIsPaid(false);
        }

        if (transport.getId() == null) {
            Payment newPayment = new Payment();
            newPayment.setPaymentEgg(0);
            newPayment.setCostEgg(0);
            newPayment.setPaymentHoney(0);
            newPayment.setCostHoney(0);
            newPayment.setTransport(transport);

            paymentRepository.save(newPayment);
        }

        Transport save = transportRepository.save(transport);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("{id}")
                .buildAndExpand(save.getId())
                .toUri();
        return ResponseEntity.created(location).body(save);
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<?>deleteTransportById (@PathVariable Long id) {
        Transport transport = transportRepository.getById(id);

        List <Product> products = productRepository.findAllByCountsTransportId(id);
        Long emporiumId = transport.getEmporium().getId();

        transportRepository.deleteById(id);

        products.forEach(value -> {
            takeProductService.addTakeProducts(value, emporiumId);
        });

        return ResponseEntity.noContent().build();
    }
}
