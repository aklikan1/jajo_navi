package jajobackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.hibernate.annotations.Cascade;

import javax.persistence.*;

@Entity
@Data
public class Count {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name = "count_id")
    private Long id;

    private Long count;

    //Many to One
    @ManyToOne
    @JoinColumn(name = "transport_id")
    private Transport transport;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

}
