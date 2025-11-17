package com.AirBNB.AirBNB.DTO;

import java.util.List;

import com.AirBNB.AirBNB.Models.PropertyStatus;
import com.AirBNB.AirBNB.Models.PropertyType;

import lombok.Data;

@Data
public class PropertyResponseDTO {
	private Long id ;
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
    private List<String> photos;
    private String title;
    private String description;
    private double weekdayPrice;
    private double weekendPrice;
    private PropertyStatus status;
    private Long hostId;
}
