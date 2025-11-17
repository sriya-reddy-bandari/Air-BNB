package com.AirBNB.AirBNB.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.AirBNB.AirBNB.Models.Host;

public interface HostRepository  extends JpaRepository <Host ,Long>  {
	boolean existsByName(String name);
	Optional<Host> findByNameIgnoreCase(String name);
	
	@Query("SELECT h FROM Host h WHERE h.id = :hostId")
	Optional<Host> findByHostId(@Param("hostId") Long hostId);
}
