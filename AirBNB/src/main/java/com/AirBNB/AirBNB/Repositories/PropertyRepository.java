package com.AirBNB.AirBNB.Repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.AirBNB.AirBNB.Models.Host;
import com.AirBNB.AirBNB.Models.Property;
import com.AirBNB.AirBNB.Models.PropertyStatus;

public interface PropertyRepository extends JpaRepository <Property,Long>  {
	List<Property> findByStatus(PropertyStatus status);
	List<Property> findByHostId(Long hostId);
	List<Property> findByHostAndStatusNotIn(Host host,List<PropertyStatus> excludedStatuses);
	
	
	@Query("SELECT p FROM Property p " +
		       "WHERE p.city = :city " +
		       "AND p.bookingstatus = com.AirBNB.AirBNB.Models.BookingStatus.PENDING " +
		       "AND p.id NOT IN (SELECT b.property.id FROM Booking b WHERE b.checkInDate <= :date AND b.checkOutDate >= :date)")
		List<Property> searchAvailableProperties(@Param("city") String city,
		                                         @Param("date") LocalDate date);
}
