package com.AirBNB.AirBNB.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;


import com.AirBNB.AirBNB.Models.JwtToken;


public interface JwtTokenRepository extends JpaRepository<JwtToken, Long> {
    JwtToken findByToken(String token);
    void deleteByToken(String token);
} 
