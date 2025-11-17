package com.AirBNB.AirBNB.Models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Data
public class Guest {

	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    private String name;

    
    private String email;

    
    private Long phone;

    private String address;
    
    // List of bookings for this guest
    @OneToMany(mappedBy = "guest", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Booking> bookings;

}

