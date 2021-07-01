package jajobackend.repository;

import jajobackend.model.Emporium;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmporiumRepository extends JpaRepository <Emporium, Long> {
    List<Emporium> findAllByOrderByIdDesc();
}
