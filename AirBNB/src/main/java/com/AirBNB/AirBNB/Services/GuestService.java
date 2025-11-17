package com.AirBNB.AirBNB.Services;

import java.time.LocalDate;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.AirBNB.AirBNB.DTO.BookingDTO;
import com.AirBNB.AirBNB.DTO.GuestDTO;
import com.AirBNB.AirBNB.Models.Booking;
import com.AirBNB.AirBNB.Models.BookingStatus;
import com.AirBNB.AirBNB.Models.Guest;
import com.AirBNB.AirBNB.Models.Host;
import com.AirBNB.AirBNB.Models.Property;
import com.AirBNB.AirBNB.Repositories.BookingRepository;
import com.AirBNB.AirBNB.Repositories.GuestRepository;
import com.AirBNB.AirBNB.Repositories.PropertyRepository;

@Service
public class GuestService {

	@Autowired
	private GuestRepository guestRepository;
	
	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private BookingRepository bookingRepository;
	
	@Autowired 
	private PropertyRepository propertyRepository;
	
	public Guest createGuest(GuestDTO guestDTO) {
	   Guest guest=modelMapper.map(guestDTO,Guest.class);
		return guestRepository.save(guest);
	}

	public boolean existsByUsername(String username) {
		return guestRepository.existsByName(username); 
	}
	
	
	
	public Booking createBooking(Long guestId, Long propertyId, LocalDate checkInDate) {

	    Guest guest = guestRepository.findById(guestId)
	            .orElseThrow(() -> new RuntimeException("Guest not found"));

	    Property property = propertyRepository.findById(propertyId)
	            .orElseThrow(() -> new RuntimeException("Property not found"));

	    Booking booking = new Booking();
	    booking.setGuest(guest);
	    booking.setProperty(property);
	    booking.setCheckInDate(checkInDate);
	    booking.setCheckOutDate(checkInDate.plusDays(1)); 
	    booking.setStatus(BookingStatus.CONFIRMED);

	    return bookingRepository.save(booking);
	}
	
	
	public List<BookingDTO> getGuestBookings(Long guestId) {
	    Guest guest = guestRepository.findById(guestId)
	            .orElseThrow(() -> new RuntimeException("Guest not found"));

	    List<Booking> bookings = bookingRepository.findByGuest(guest);

	    // Convert to DTO to avoid infinite JSON recursion
	    return bookings.stream().map(booking -> {
	        BookingDTO dto = new BookingDTO();
	        dto.setBookingId(booking.getId());
	        dto.setCheckInDate(booking.getCheckInDate());
	        dto.setCheckOutDate(booking.getCheckOutDate());
	        dto.setStatus(booking.getStatus());
	        
	        // Property info
	        Property property = booking.getProperty();
	        dto.setPropertyId(property.getId());
	        dto.setPropertyTitle(property.getTitle());
	        dto.setPropertyAddress(property.getAddress());
	        dto.setPropertyCity(property.getCity());
	        dto.setPropertyCountry(property.getCountry());

	        // Host info
	        Host host = property.getHost();
	        dto.setHostName(host.getName());
	        dto.setHostPhone(host.getPhone());
	        dto.setHostEmail(host.getEmail());

	        return dto;
	    }).toList();
	}
	
	public List<Guest> getAllGuests() {
        return guestRepository.findAll();
    }



}
