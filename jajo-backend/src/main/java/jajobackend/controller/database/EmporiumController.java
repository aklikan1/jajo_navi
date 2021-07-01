package jajobackend.controller.database;

import jajobackend.model.Count;
import jajobackend.model.Emporium;
import jajobackend.repository.EmporiumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/emporium")
@CrossOrigin(origins = "http://localhost:4200")
public class EmporiumController {

    private final EmporiumRepository emporiumRepository;

    @Autowired
    public EmporiumController(EmporiumRepository emporiumRepository) {
        this.emporiumRepository = emporiumRepository;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Emporium>> getAllEmporiums() {
        List<Emporium> emporiums = emporiumRepository.findAllByOrderByIdDesc();
        return ResponseEntity.ok(emporiums);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> saveNewEmporium(@RequestBody Emporium emporium) {
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
