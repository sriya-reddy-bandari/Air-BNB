package com.AirBNB.AirBNB.Controllers;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.AirBNB.AirBNB.DTO.BookingDTO;
import com.AirBNB.AirBNB.DTO.GuestDTO;

import com.AirBNB.AirBNB.DTO.PropertyResponseDTO;
import com.AirBNB.AirBNB.Models.Booking;
import com.AirBNB.AirBNB.Models.Guest;
import com.AirBNB.AirBNB.Models.Property;
import com.AirBNB.AirBNB.Repositories.GuestRepository;
import com.AirBNB.AirBNB.Services.GuestService;
import com.AirBNB.AirBNB.Services.PropertyService;

@RestController
@RequestMapping("/api/guest")
public class GuestController {
	
	@Autowired
	 private PropertyService propertyService;
	
	@Autowired
	private GuestService guestService;
	
	@Autowired
	private GuestRepository guestRepository;
	 
	 @GetMapping("/approved")
	 @PreAuthorize("hasRole('ROLE_GUEST')")
	 public List<PropertyResponseDTO> getApprovedProperties(){
		 return propertyService.getPropertiesForGuests();
	 }
	 
	@PostMapping("/create-guest")
	@PreAuthorize("hasRole('ROLE_GUEST')")
	public ResponseEntity<Guest> createGuest(@RequestBody GuestDTO guestDTO){
			return ResponseEntity.ok(guestService.createGuest(guestDTO));
		}
	
	@GetMapping("/exists/{username}")
	@PreAuthorize("hasRole('ROLE_GUEST')")
	public ResponseEntity<Map<String, Boolean>> checkGuestExists(@PathVariable String username) {
	    boolean exists = guestService.existsByUsername(username); // returns true if guest exists
	    Map<String, Boolean> response = new HashMap<>();
	    response.put("exists", exists);
	    return ResponseEntity.ok(response);
	}
	
	@GetMapping("/id/{username}")
	@PreAuthorize("hasRole('ROLE_GUEST')")
	public ResponseEntity<Long> getGuestId(@PathVariable String username) {
	    Guest guest = guestRepository.findByNameIgnoreCase(username)
	            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Host not found"));
	    return ResponseEntity.ok(guest.getId());
	}
	
	
	@GetMapping("/details/{hostId}")
	@PreAuthorize("hasRole('ROLE_GUEST')")
	public ResponseEntity<Guest> getGuestDetails(@PathVariable Long hostId) {
	    Guest guest = guestRepository.findById(hostId)
	        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Host not found"));
	    return ResponseEntity.ok(guest);
	}
	
	@GetMapping("/search")
	public ResponseEntity<List<Property>> searchProperties(
	        @RequestParam String city,
	        @RequestParam String checkInDate) {

	    LocalDate date = LocalDate.parse(checkInDate);
	    List<Property> properties = propertyService.searchProperties(city, date);

	    return ResponseEntity.ok(properties);
	}
	
	@GetMapping("/properties/{propertyId}")
	@PreAuthorize("hasRole('ROLE_GUEST')")
	public ResponseEntity<Property> getPropertyById(@PathVariable Long propertyId){
		return ResponseEntity.ok(propertyService.getPropertyById(propertyId));
	}
   
	
 
	@PostMapping("/book/{guestId}/{propertyId}/{checkInDate}")
	@PreAuthorize("hasRole('ROLE_GUEST')")
	public Booking createBooking(
	        @PathVariable Long guestId,
	        @PathVariable Long propertyId,
	        @PathVariable String checkInDate
	) {
	    LocalDate date = LocalDate.parse(checkInDate);
	    return guestService.createBooking(guestId, propertyId, date);
	}
	
	
	@GetMapping("/bookings/{guestId}")
	@PreAuthorize("hasRole('ROLE_GUEST')")
	public List<BookingDTO> getGuestBookings(@PathVariable Long guestId) {
	    return guestService.getGuestBookings(guestId);
	}



}
