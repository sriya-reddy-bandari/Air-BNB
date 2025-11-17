package com.AirBNB.AirBNB.Models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.util.Date;

@Entity
@Data
@NoArgsConstructor
public class JwtToken {

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String username;
	    private String role;

	    @Column(length = 1000) 
	    private String token;

	    private Date createdAt;
	    
	    public JwtToken(String username, String role, String token) {
	        this.username = username;
	        this.role = role;
	        this.token = token;
	        this.createdAt = new Date();
	    }
}


