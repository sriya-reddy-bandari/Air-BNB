package com.AirBNB.AirBNB.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.AirBNB.AirBNB.Models.User;

public interface UserRepository  extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
  
} 