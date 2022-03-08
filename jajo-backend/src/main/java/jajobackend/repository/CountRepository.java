package jajobackend.repository;

import jajobackend.model.Count;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.relational.core.sql.In;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CountRepository extends JpaRepository<Count, Long> {
    List<Count> findAllByTransportEmporiumIdOrderByProductHierarchyAsc(Long id);
    List<Count> findAllByTransportIdAndTransportEmporiumIdOrderByProductHierarchyAsc(Long transport_id, Long emporium_id);
    List<Count> findAllByTransportIdOrderByProductHierarchyAsc (Long id);

    boolean existsCountById (Long id);

    //Native SQL
    @Query("SELECT SUM(c.count) FROM Count c WHERE c.transport.id IN (SELECT t.id FROM Transport t WHERE t.emporium.id = :emporium_id) " +
            "AND c.product.id = :product_id")
    Integer sumCountByProductIdAndEmporiumId(
            @Param("product_id") Long product_id,
            @Param("emporium_id") Long emporium_id);

    @Query("SELECT SUM(c.liquid) FROM Count c WHERE c.transport.id IN (SELECT t.id FROM Transport t WHERE t.emporium.id = :emporium_id) " +
            "AND c.product.id = :product_id")
    Integer sumLiquidByProductIdAndEmporiumId(
            @Param("product_id") Long product_id,
            @Param("emporium_id") Long emporium_id);
}
