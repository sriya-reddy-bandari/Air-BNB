package com.AirBNB.AirBNB.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.AirBNB.AirBNB.Models.Guest;
import com.AirBNB.AirBNB.Models.Host;

public interface GuestRepository extends JpaRepository  <Guest ,Long> {
	boolean existsByName(String name);
	Optional<Guest> findByNameIgnoreCase(String name);
	
	@Query("SELECT g FROM Guest g WHERE g.id = :guestId")
	Optional<Host> findByHostId(@Param("guestId") Long guestId);
}
