package com.AirBNB.AirBNB.Models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Property {
	@Id 
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@Enumerated(EnumType.STRING)
	private PropertyType propertyType;
	
	private int maxGuests;
	private int bedrooms;
	private int beds;
	private int bathrooms;
	
	private boolean wifi;
	private boolean airConditioner;
	private boolean parking;
	private boolean swimmingPool;
	
	private String address;
	private String city;
	private String country;
	private double latitude;
	private double longitude;
	
	@ElementCollection 
	private List<String> photos;
	
	private String title;
	private String description;
	
	
	private double weekdayPrice;
	private double weekendPrice;
	private double hostEarningWeekday;
	private double hostEarningWeekend;
	
	
	@Enumerated(EnumType.STRING)
	private PropertyStatus status =PropertyStatus.DRAFT;
	
	@Enumerated(EnumType.STRING)
	private BookingStatus bookingstatus =BookingStatus.PENDING;
	
	
	@ManyToOne
	@JoinColumn(name="host_id")
	@JsonIgnore
	private Host host;
	
	@OneToMany(mappedBy = "property", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<Booking> bookings;
} 
