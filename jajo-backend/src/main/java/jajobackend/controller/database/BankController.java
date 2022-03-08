package jajobackend.controller.database;

import jajobackend.model.Bank;
import jajobackend.repository.BankRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/bank")
@CrossOrigin(origins = "http://localhost:4200")
public class BankController {

    private final BankRepository bankRepository;

    @Autowired
    public BankController(BankRepository bankRepository) {
        this.bankRepository = bankRepository;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Bank>> getAllBankDetails() {
        List<Bank> banks = bankRepository.findAll();
        return ResponseEntity.ok(banks);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?>saveNewBank(@RequestBody Bank bank) {
        Bank save = bankRepository.save(bank);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("{id}")
                .buildAndExpand(save.getId())
                .toUri();
        return ResponseEntity.created(location).body(save);
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<?> deleteBankById (@PathVariable Long id) {
        bankRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
