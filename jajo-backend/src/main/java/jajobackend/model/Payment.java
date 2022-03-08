package jajobackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long id;

    @Column
    private Integer paymentEgg;

    @Column
    private Integer costEgg;

    @Column
    private Integer paymentHoney;

    @Column
    private Integer costHoney;

    @Transient
    private Integer totalPayment;

    @Transient
    private Integer totalCost;

    @OneToOne(cascade = CascadeType.ALL)
    @JsonIgnore
    @ToString.Exclude
    @JoinColumn(name = "transport_id", referencedColumnName = "transport_id")
    private Transport transport;
}
