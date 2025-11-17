package com.AirBNB.AirBNB.Models;

import java.util.List;

import jakarta.persistence.*;

import lombok.Data;

@Entity
@Data
public class Host {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	private String name;
	private String email;
	private Long phone;
	private String address;
	
	@OneToMany(mappedBy="host",cascade=CascadeType.ALL, orphanRemoval=true)
	private List<Property> properties;
	

}
  