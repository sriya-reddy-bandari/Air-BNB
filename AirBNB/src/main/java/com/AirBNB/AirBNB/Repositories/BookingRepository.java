package com.AirBNB.AirBNB.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.AirBNB.AirBNB.Models.Booking;
import com.AirBNB.AirBNB.Models.Guest;
import com.AirBNB.AirBNB.Models.Host;



public interface BookingRepository  extends JpaRepository  <Booking ,Long>{
	Optional<Booking> findById(Long bookingId);
	List<Booking> findByGuest(Guest guest);
	List<Booking> findByProperty_Host(Host host);
}
