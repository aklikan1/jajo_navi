package jajobackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.Cascade;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
public class Emporium {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name = "emporium_id")
    private Long id;

    private String name;

    private Boolean isSunday;

    //One to One
    @OneToOne(mappedBy = "emporium")
    @JsonIgnore
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
    private ProductsIncome productsIncome;

    //One to Many
    @OneToMany (mappedBy = "emporium")
    @JsonIgnore
    @ToString.Exclude
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
    private List<Transport> transports;

}
