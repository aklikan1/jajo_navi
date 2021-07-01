package jajobackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
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

    //One to Many
    @OneToMany(mappedBy = "address")
    @JsonIgnore
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
    private List<Transport> transports;

    public Address() {}
}
