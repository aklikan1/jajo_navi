package jajobackend.controller.database;

import jajobackend.model.Address;
import jajobackend.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping ("/api/address")
@CrossOrigin(origins = "http://localhost:4200")
public class AddressController {

    private final AddressRepository addressRepository;

    @Autowired
    public AddressController (AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Address>> allAddressDetails() {
        List<Address> addresses = addressRepository.findAllByOrderByHierarchyAsc();
        return ResponseEntity.ok(addresses);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?>saveNewAddress(@RequestBody Address address) {
        Address save = addressRepository.save(address);
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
