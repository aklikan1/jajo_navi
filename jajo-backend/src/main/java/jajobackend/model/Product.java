package jajobackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.hibernate.annotations.Cascade;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Entity
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long id;

    @Column (nullable = false, length = 100)
    private String name;

    @Column (nullable = false)
    private Long price;

    @Column (nullable = false)
    private Long cost;

    @Column (nullable = false)
    private Long hierarchy;

    //One to Many
    @OneToMany (mappedBy = "product")
    @JsonIgnore
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
    private List<Count> counts;

    public Product() {}
}
