package jajobackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.hibernate.annotations.Cascade;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    Long id;

    @Column(nullable = false)
    String name;

    @Column (nullable = false, length = 500)
    String message;

    // One to Many
    @OneToMany (mappedBy = "message")
    @JsonIgnore
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
    private List<Transport> transports;
}
