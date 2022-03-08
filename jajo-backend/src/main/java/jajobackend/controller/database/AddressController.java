package jajobackend.controller.database;

import jajobackend.model.Address;
import jajobackend.model.Bank;
import jajobackend.model.Transport;
import jajobackend.repository.AddressRepository;
import jajobackend.repository.BankRepository;
import jajobackend.repository.TransportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping ("/api/address")
@CrossOrigin(origins = "http://localhost:4200")
public class AddressController {

    private final AddressRepository addressRepository;
    private final TransportRepository transportRepository;
    private final BankRepository bankRepository;

    @Autowired
    public AddressController (AddressRepository addressRepository, TransportRepository transportRepository,
                              BankRepository bankRepository) {
        this.addressRepository = addressRepository;
        this.transportRepository = transportRepository;
        this.bankRepository = bankRepository;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Address>> allAddressDetails() {
        List<Address> addresses = addressRepository.findAllByOrderByHierarchyAsc();
        return ResponseEntity.ok(addresses);
    }

    @GetMapping(path = "available/emporium/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Address>> availableAddressesInTransportByEmporiumId (@PathVariable Long id) {
        List<Address> allAddresses = addressRepository.findAllByOrderByHierarchyAsc();
        List<Transport> transportByEmporiumId = transportRepository.findAllByEmporiumIdOrderByAddressHierarchyAsc(id);
        List<Address> existingAddresses = new ArrayList<>();

        transportByEmporiumId.forEach(e -> existingAddresses.add(e.getAddress()));

        //System.out.println("Wszystkie adresy: " + allAddresses);
        allAddresses.removeAll(existingAddresses);
        //System.out.println("Adresy po usunięciu: " + allAddresses);

        return ResponseEntity.ok(allAddresses);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?>saveNewAddress(@RequestBody Address address) {
        Address save = addressRepository.save(address);

        if (address.getId() == null) {
            Bank bank = new Bank();
            bank.setOverpay(0);
            bank.setAddress(save);
            bankRepository.save(bank);
        }

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("{id}")
                .buildAndExpand(save.getId())
                .toUri();
        return ResponseEntity.created(location).body(save);
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<?>deleteAddressById (@PathVariable Long id) {
        addressRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
