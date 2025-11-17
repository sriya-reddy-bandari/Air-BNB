package com.AirBNB.AirBNB.Models;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Booking {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many bookings can belong to one guest
    @ManyToOne
    @JoinColumn(name = "guest_id", nullable = false)
    @JsonIgnore
    private Guest guest;

    // Many bookings can belong to one property
    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(nullable = false)
    private LocalDate checkInDate;

    @Column(nullable = false)
    private LocalDate checkOutDate;

    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING; 
}
