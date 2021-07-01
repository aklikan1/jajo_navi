package jajobackend.repository;

import jajobackend.model.Count;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CountRepository extends JpaRepository<Count, Long> {
    List<Count> findAllByTransportEmporiumIdOrderByProductHierarchyAsc(Long id);
    List<Count> findAllByTransportIdAndTransportEmporiumIdOrderByProductHierarchyAsc(Long transport_id, Long emporium_id);
}
