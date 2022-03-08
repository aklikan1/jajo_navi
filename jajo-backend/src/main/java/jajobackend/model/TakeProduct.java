package jajobackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.ToString;

import javax.persistence.*;

@Data
@Entity
public class TakeProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "takeProduct_id")
    private Long id;

    private Long productId;
    private String productName;
    private Integer productCount;
    private Integer liquid;
    private Long productHierarchy;

    @ManyToOne
    @ToString.Exclude
    @JsonIgnore
    @JoinColumn(name = "productsIncome_id")
    ProductsIncome productsIncome;
}
