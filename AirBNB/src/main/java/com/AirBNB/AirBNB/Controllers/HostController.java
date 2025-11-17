package com.AirBNB.AirBNB.Controllers;

import java.io.IOException;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import com.AirBNB.AirBNB.DTO.BookingDTO;
import com.AirBNB.AirBNB.DTO.HostDTO;
import com.AirBNB.AirBNB.Models.Booking;
import com.AirBNB.AirBNB.Models.Guest;
import com.AirBNB.AirBNB.Models.Host;
import com.AirBNB.AirBNB.Models.Property;
import com.AirBNB.AirBNB.Repositories.BookingRepository;
import com.AirBNB.AirBNB.Repositories.HostRepository;
import com.AirBNB.AirBNB.Services.HostService;
import com.AirBNB.AirBNB.Services.PropertyService;




@RestController
@RequestMapping("/api/host")
public class HostController {

	
	@Autowired
	private PropertyService propertyService;
	
	@Autowired
	private HostService hostService;
	 
	@Autowired
	private HostRepository hostRepository;
	
	
	@Autowired
	private BookingRepository bookingRepository;
	
	
	@PostMapping("/{hostId}/properties")
	@PreAuthorize("hasRole('ROLE_HOST')")
	public Property createProperty(@PathVariable Long hostId, @RequestBody Property propertyDTO) {
		return propertyService.createProperty(hostId,propertyDTO);
	}
	
	@GetMapping("{hostId}/properties")
	@PreAuthorize("hasRole('ROLE_HOST')")
	public List<Property> getHostProperties(@PathVariable Long hostId){
		return propertyService.getHostProperties(hostId);
	}
	
	@PatchMapping("/{hostId}/properties/{propertyId}")
	@PreAuthorize("hasRole('ROLE_HOST')")
	public ResponseEntity<Property> partialUpdateProperty(@PathVariable Long hostId,@PathVariable Long propertyId,@RequestBody Property dto){
		return ResponseEntity.ok(propertyService.partialUpdateProperty(hostId,propertyId,dto));
	}
	
	@PatchMapping("/{hostId}/request-delete/{propertyId}") 
	@PreAuthorize("hasRole('ROLE_HOST')")
	public ResponseEntity<Property> requestDeleteProperty(@PathVariable Long hostId,@PathVariable Long propertyId){
		return ResponseEntity.ok(propertyService.requestDeleteProperty(hostId,propertyId));
	}
	
	@GetMapping("/{hostId}/properties/{propertyId}")
	@PreAuthorize("hasRole('ROLE_HOST')")
	public ResponseEntity<Property> getHostPropertyById(@PathVariable Long hostId,@PathVariable Long propertyId){
		return ResponseEntity.ok(propertyService.getHostPropertyById(hostId,propertyId));
	}
	
	@PostMapping("/create-host")
	@PreAuthorize("hasRole('ROLE_HOST')")
	public ResponseEntity<Host> createHost(@RequestBody HostDTO hostDTO){
		return ResponseEntity.ok(hostService.createHost(hostDTO));
	}
	
	@GetMapping("/exists/{name}")
	@PreAuthorize("hasRole('ROLE_HOST')")
	public ResponseEntity<Boolean> hostExists(@PathVariable String name) {
	    boolean exists = hostRepository.existsByName(name); // ✅ Match repository method
	    return ResponseEntity.ok(exists);
	}
	
	@PostMapping("/upload")
	@PreAuthorize("hasRole('ROLE_HOST')")
	public ResponseEntity<?> uploadPhotos(@RequestParam("files") List<MultipartFile> files) {
	    try {
	        List<String> photoUrls = new ArrayList<>();

	        for (MultipartFile file : files) {
	            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
	            java.nio.file.Path filePath = Paths.get("uploads", fileName);
	            Files.createDirectories(filePath.getParent());
	            Files.write(filePath, file.getBytes());

	            // You can return a URL if using static resource mapping
	            photoUrls.add("/uploads/" + fileName);
	        }

	        return ResponseEntity.ok(photoUrls);

	    } catch (IOException e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("Error uploading files"); 
	    }
	} 
	
	@GetMapping("/details/{hostId}")
	@PreAuthorize("hasRole('ROLE_HOST')")
	public ResponseEntity<Host> getHostDetails(@PathVariable Long hostId) {
	    Host host = hostRepository.findById(hostId)
	        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Host not found"));
	    return ResponseEntity.ok(host);
	}

	
	@GetMapping("/id/{username}")
	@PreAuthorize("hasRole('ROLE_HOST')")
	public ResponseEntity<Long> getHostId(@PathVariable String username) {
	    Host host = hostRepository.findByNameIgnoreCase(username)
	            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Host not found"));
	    return ResponseEntity.ok(host.getId());
	}
	
	@GetMapping("/uploads/{filename:.+}")
	@PreAuthorize("hasAnyRole('ROLE_HOST', 'ROLE_ADMIN','ROLE_GUEST')")
	public ResponseEntity<Resource> getHostUpload(@PathVariable String filename) {
	    try {
	        // Only the actual filename, no "/uploads/" prefix
	        Path file = Paths.get("uploads").resolve(filename).normalize();
	        Resource resource = new UrlResource(file.toUri());

	        if (!resource.exists()) {
	            return ResponseEntity.notFound().build();
	        }

	        return ResponseEntity.ok()
	                .header(HttpHeaders.CONTENT_TYPE, Files.probeContentType(file))
	                .body(resource);

	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	    }
	}

	@GetMapping("/bookings/{hostId}")
	@PreAuthorize("hasRole('ROLE_HOST')")
	public List<BookingDTO> getHostBookings(@PathVariable Long hostId) {
	    Host host = hostRepository.findById(hostId)
	            .orElseThrow(() -> new RuntimeException("Host not found"));

	    List<Booking> bookings = bookingRepository.findByProperty_Host(host);

	    return bookings.stream().map(booking -> {
	        BookingDTO dto = new BookingDTO();
	        dto.setBookingId(booking.getId());
	        dto.setCheckInDate(booking.getCheckInDate());
	        dto.setCheckOutDate(booking.getCheckOutDate());
	        dto.setStatus(booking.getStatus());

	        Property property = booking.getProperty();
	        dto.setPropertyId(property.getId());
	        dto.setPropertyTitle(property.getTitle());
	        dto.setPropertyCity(property.getCity());
	        dto.setPropertyCountry(property.getCountry());
	        dto.setPropertyAddress(property.getAddress());

	        // Guest info
	        Guest guest = booking.getGuest();
	        dto.setGuestName(guest.getName());
	        dto.setGuestPhone(guest.getPhone());
	        dto.setGuestEmail(guest.getEmail());

	        return dto;
	    }).toList();
	}



}
