package com.AirBNB.AirBNB.Services;

import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.AirBNB.AirBNB.DTO.HostDTO;
import com.AirBNB.AirBNB.Models.Host;
import com.AirBNB.AirBNB.Repositories.HostRepository;

@Service
public class HostService {
	
	@Autowired
	private HostRepository hostRepository;
	
	@Autowired
	private ModelMapper modelMapper;
	
	public Host createHost(HostDTO hostDTO) {
		Host host=modelMapper.map(hostDTO,Host.class);
		return hostRepository.save(host);
	}

	public Optional<Host> getHostById(Long hostId) {
		return hostRepository.findById(hostId);
	}

	public List<Host> getAllHosts() {
		return hostRepository.findAll();
	}
}
