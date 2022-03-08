package jajobackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.Cascade;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
public class ProductsIncome {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "productsIncome_id")
    private Long id;

    private Integer incomeMoney;
    private Integer izaMoney;

    //One to One
    @OneToOne(cascade = CascadeType.ALL)
    @ToString.Exclude
    @JoinColumn(name = "emporium_id", referencedColumnName = "emporium_id")
    private Emporium emporium;

    @OneToMany (mappedBy = "productsIncome", cascade = CascadeType.ALL)
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
    private List<TakeProduct> takeProducts;
}
