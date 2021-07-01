package jajobackend.controller.database;

import jajobackend.model.Count;
import jajobackend.model.Transport;
import jajobackend.repository.CountRepository;
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

    @Autowired
    public CountController(CountRepository countRepository) {
        this.countRepository = countRepository;
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
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("{id}")
                .buildAndExpand(save.getId())
                .toUri();
        return ResponseEntity.created(location).body(save);
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<?>deleteCountById (@PathVariable Long id) {
        countRepository.deleteById(id);
        return ResponseEntity.noContent().build();

    }
}
