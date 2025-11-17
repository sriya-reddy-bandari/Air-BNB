package com.AirBNB.AirBNB.Controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.AirBNB.AirBNB.Models.Guest;
import com.AirBNB.AirBNB.Models.Host;
import com.AirBNB.AirBNB.Models.Property;
import com.AirBNB.AirBNB.Models.PropertyStatus;
import com.AirBNB.AirBNB.Services.GuestService;
import com.AirBNB.AirBNB.Services.HostService;
import com.AirBNB.AirBNB.Services.PropertyService;


@RestController
@RequestMapping("/api/admin")
public class AdminController {
	
    @Autowired
    private PropertyService propertyService;
    
    @Autowired
    private HostService hostService;
	
    @Autowired
    private GuestService guestService;
    
	@PatchMapping("/approve-delete/{propertyId}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<Property> approveDeleteProperty(@PathVariable Long propertyId)
	{
		return ResponseEntity.ok(propertyService.approveDeleteProperty(propertyId));
	}
	
	@PatchMapping("/{propertyId}/approve")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<Property> approveProperty(@PathVariable Long propertyId){
	     return ResponseEntity.ok(propertyService.approveCreatedProperty(propertyId));
	}
	
	@PatchMapping("/{propertyId}/rejected")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<Property> rejectProperty(@PathVariable Long propertyId){
	     return ResponseEntity.ok(propertyService.rejectCreatedProperty(propertyId));
	}
	
	@GetMapping("/properties-status/{status}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<Property>> getPropertiesByStatus(@PathVariable PropertyStatus status){
		return ResponseEntity.ok(propertyService.getAllPropertiesForAdminByStatus(status));
		}
	
	@GetMapping("/host/{hostId}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<Optional<Host>> getHostById(@PathVariable Long hostId){
		return ResponseEntity.ok(hostService.getHostById(hostId));
	}
	
	@GetMapping("/hosts")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public List<Host> getAllHosts(){
		return hostService.getAllHosts();
	}
	
	@GetMapping("/properties/{propertyId}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<Property> getHostPropertyById(@PathVariable Long propertyId){
		return ResponseEntity.ok(propertyService.getPropertyById(propertyId));
	}
	@GetMapping("/guests")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public List<Guest> getAllGuests() {
	    return guestService.getAllGuests();
	}
	
}
