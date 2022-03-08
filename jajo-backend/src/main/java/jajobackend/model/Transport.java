package jajobackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.Cascade;

import javax.persistence.*;
import java.sql.Time;
import java.util.List;
import java.util.Set;

@Entity
@Data
public class Transport {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name = "transport_id")
    private Long id;

    @Column(length = 5, nullable = false)
    private Time time;

    @Column (nullable = false, columnDefinition="bool default false")
    private Boolean isSent;

    @Column (nullable = false, columnDefinition="bool default false")
    private Boolean isPaid;

    @Transient
    private List<Product> actualProducts;

    @Transient
    private List<Product> availableProducts;

    //One to One
    @OneToOne(mappedBy = "transport", cascade = CascadeType.ALL)
    private Payment payment;

    //One to Many
    @OneToMany (mappedBy = "transport", cascade = CascadeType.ALL)
    @JsonIgnore
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
    private List<Count> counts;

    //Many to One
    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;

    @ManyToOne
    @JoinColumn(name = "emporium_id")
    private Emporium emporium;
}
