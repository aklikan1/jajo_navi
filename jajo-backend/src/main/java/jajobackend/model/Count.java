package jajobackend.model;

import lombok.Data;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Data
public class Count {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name = "count_id")
    private Long id;

    @Column
    private Integer count;

    @Column
    private Integer liquid;

    //Many to One
    @ManyToOne
    @ToString.Exclude
    @JoinColumn(name = "transport_id")
    private Transport transport;

    @ManyToOne
    @ToString.Exclude
    @JoinColumn(name = "product_id")
    private Product product;

}
