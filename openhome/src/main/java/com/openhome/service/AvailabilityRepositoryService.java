package com.openhome.service;

import javax.persistence.EntityManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.openhome.entity.Availability;

import com.openhome.repository.AvailabilityRepository;

@Service
public class AvailabilityRepositoryService {
	
	@Autowired
	AvailabilityRepository availabilityRepository;
	
	@Autowired
	EntityManager entityManager;
	
	public String setAvailability(Availability availability) {
		
		Availability avail = availabilityRepository.save(availability); 
		return " Availability Set";
	}
}
