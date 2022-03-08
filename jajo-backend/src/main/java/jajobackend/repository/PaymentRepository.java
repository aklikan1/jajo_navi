package jajobackend.repository;

import jajobackend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Payment getByTransportId (Long id);
    List<Payment> getAllByTransportEmporiumIdOrderByTransportAddressHierarchyAsc (Long id);

    @Query("SELECT SUM(p.paymentEgg) - SUM(p.costEgg) + SUM(p.paymentHoney) - SUM(p.costHoney) " +
            "FROM Payment p WHERE p.transport.id IN " +
            "(SELECT t.id FROM Transport t WHERE t.emporium.id = :emporiumId)")
    Integer sumIncomeMoney(@Param("emporiumId") Long emporiumId);

    @Query("SELECT SUM(p.costHoney) FROM Payment p WHERE p.transport.id IN " +
            "(SELECT t.id FROM Transport t WHERE t.emporium.id = :emporiumId)")
    Integer sumMoneyForIza (@Param("emporiumId") Long emporiumId);

}
