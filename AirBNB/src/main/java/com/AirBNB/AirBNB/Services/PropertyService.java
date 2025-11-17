package com.AirBNB.AirBNB.Services;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.AirBNB.AirBNB.DTO.PropertyResponseDTO;
import com.AirBNB.AirBNB.Models.Host;
import com.AirBNB.AirBNB.Models.Property;
import com.AirBNB.AirBNB.Models.PropertyStatus;
import com.AirBNB.AirBNB.Repositories.HostRepository;
import com.AirBNB.AirBNB.Repositories.PropertyRepository;

@Service
public class PropertyService {
	@Autowired 
	private PropertyRepository propertyRepository;
	
	@Autowired
	private HostRepository hostRepository;
	
	@Autowired
	private ModelMapper modelMapper;
	
	public Property createProperty (Long hostId, Property property) {
		
		Host host=hostRepository.findById(hostId)
				        .orElseThrow(() -> new RuntimeException("Host not found"));
				        
		Property prop= modelMapper.map(property,Property.class);
		prop.setHost(host);
		prop.setStatus(PropertyStatus.PENDING_APPROVAL);
		
		return propertyRepository.save(prop);
				
	}
	
	public List<Property> getAllPropertiesForAdminByStatus(PropertyStatus status){
		return propertyRepository.findByStatus(status);
	}
	
	public List<Property> getHostProperties(Long hostId){
		List<PropertyStatus> excludedStatuses=List.of(PropertyStatus.DELETE_REQUESTED,PropertyStatus.DELETED);
		Host host = hostRepository.findById(hostId)
                .orElseThrow(() -> new RuntimeException("Host not found"));
		return propertyRepository.findByHostAndStatusNotIn(host,excludedStatuses);
				
	}
	
	
	public Property getPropertyById(Long propertyId) {
		Property property =propertyRepository.findById(propertyId)
	            .orElseThrow(()-> new RuntimeException("Property not found"));
		
		if(property.getStatus() == PropertyStatus.DELETED || property.getStatus() ==  PropertyStatus.DELETE_REQUESTED) {
			throw new RuntimeException("Property not available");
		}
		
		return property;
		
	}
	
	public Property getHostPropertyById(Long hostId,Long propertyId) {
		Property property =propertyRepository.findById(propertyId)
	            .orElseThrow(()-> new RuntimeException("Property not found"));
		if(!property.getHost().getId().equals(hostId)) {
			throw new RuntimeException("Property does not belong to the given host");
		}
		
		if(property.getStatus() == PropertyStatus.DELETED || property.getStatus() ==  PropertyStatus.DELETE_REQUESTED) {
			throw new RuntimeException("Property not available");
		}
		
		return property;
		
	}
	
	public List<PropertyResponseDTO> getPropertiesForGuests(){
		List<Property> approvedProperties = propertyRepository.findByStatus(PropertyStatus.APPROVED);
		return approvedProperties.stream()
				                  .map(property-> modelMapper.map(property, PropertyResponseDTO.class))
				                  .collect(Collectors.toList());
		
		
	}

	
	public Property partialUpdateProperty(Long hostId,Long propertyId, Property dto) {
		Host host= hostRepository.findById(hostId)
				                .orElseThrow(()-> new RuntimeException("Host not found"));
		
		Property property =propertyRepository.findById(propertyId)
				            .orElseThrow(()-> new RuntimeException("Property not found"));
		
		if(!property.getHost().getId().equals(host.getId())) {
			throw new RuntimeException("Property does not belong to the given host");
		}
		
		modelMapper.getConfiguration().setSkipNullEnabled(true);
		
		modelMapper.map(dto, property);
		
		if(dto.getWeekdayPrice()>0) property.setWeekdayPrice(dto.getWeekdayPrice());
		if(dto.getWeekendPrice()>0) property.setWeekendPrice(dto.getWeekendPrice());
		if(dto.getMaxGuests()>0 ) property.setMaxGuests(dto.getMaxGuests());
		if(dto.getBedrooms()>0 ) property.setBedrooms(dto.getBedrooms());
		if(dto.getBeds()>0 ) property.setBeds(dto.getBeds());
		if(dto.getBathrooms()>0 ) property.setBathrooms(dto.getBathrooms());
		
		return propertyRepository.save(property);
	}
	
	public Property requestDeleteProperty(Long hostId,Long propertyId) {
		Host host= hostRepository.findById(hostId)
                .orElseThrow(()-> new RuntimeException("Host not found"));

        Property property =propertyRepository.findById(propertyId)
            .orElseThrow(()-> new RuntimeException("Property not found"));
    	if(!property.getHost().getId().equals(host.getId())){
    		throw new RuntimeException("Not authorized to delete the property");
    	}
    	
    	property.setStatus(PropertyStatus.DELETE_REQUESTED);
    	return propertyRepository.save(property);

	}
	
	public Property approveDeleteProperty(Long propertyId) {
	    Property property =propertyRepository.findById(propertyId)
	            .orElseThrow(()-> new RuntimeException("Property not found"));
	    if(property.getStatus()!=PropertyStatus.DELETE_REQUESTED) {
	    	throw new RuntimeException("Property deletion not requested");
	    }
	    
	    property.setStatus(PropertyStatus.DELETED);
	    return propertyRepository.save(property);
	}
	
	public Property approveCreatedProperty(Long propertyId) {
		 Property property =propertyRepository.findById(propertyId)
		            .orElseThrow(()-> new RuntimeException("Property not found"));
		 
		 if(property.getStatus()!=PropertyStatus.PENDING_APPROVAL) {
			 throw new RuntimeException("Property is not pending approval");
		 }
		 
		 property.setStatus(PropertyStatus.APPROVED);
		 return propertyRepository.save(property);
		 }
	
	
	
	
	
	public Property rejectCreatedProperty(Long propertyId) {
		 Property property =propertyRepository.findById(propertyId)
		            .orElseThrow(()-> new RuntimeException("Property not found"));
		 
		 if(property.getStatus()!=PropertyStatus.PENDING_APPROVAL) {
			 throw new RuntimeException("Property is not pending approval");
		 }
		 
		 property.setStatus(PropertyStatus.REJECTED);
		 return propertyRepository.save(property);
		 }
	
	
	
	public List<Property> searchProperties(String city, LocalDate date) {
	    return propertyRepository.searchAvailableProperties(city, date);
	}
}

