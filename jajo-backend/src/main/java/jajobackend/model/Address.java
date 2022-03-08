package jajobackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.Cascade;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
public class Address {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name = "address_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer hierarchy;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private Boolean isMrMrs;

    //One to One
    @OneToOne(mappedBy = "address", cascade = CascadeType.ALL)
    private Bank bank;

    //One to Many
    @OneToMany(mappedBy = "address")
    @JsonIgnore
    @ToString.Exclude
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
    private List<Transport> transports;

    public Address() {}
}
