package jajobackend.repository;

import jajobackend.model.Transport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransportRepository extends JpaRepository<Transport, Long> {

    List<Transport> findAllByOrderByAddressHierarchyAsc();
    List<Transport> findAllByEmporiumIdOrderByAddressHierarchyAsc(Long id);
    List<Transport> findAllByEmporiumId(Long id);
}
