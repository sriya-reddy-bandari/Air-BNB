package com.AirBNB.AirBNB.DTO;

import java.time.LocalDate;

import com.AirBNB.AirBNB.Models.BookingStatus;

import lombok.Data;

@Data
public class BookingDTO {
	  private Long bookingId;
	    private LocalDate checkInDate;
	    private LocalDate checkOutDate;
	    private BookingStatus status;

	    private Long propertyId;
	    private String propertyTitle;
	    private String propertyAddress;
	    private String propertyCity;
	    private String propertyCountry;

	    private String hostName;
	    private Long hostPhone;
	    private String hostEmail;
	    
	    
	    private String guestName;
	    private Long guestPhone;
	    private String guestEmail;
}
