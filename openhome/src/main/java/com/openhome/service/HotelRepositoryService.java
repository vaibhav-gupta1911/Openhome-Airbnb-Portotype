package com.openhome.service;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.StoredProcedureQuery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.openhome.entity.Hotel;
import com.openhome.entity.Property;
import com.openhome.repository.HotelRepository;;

@Service
public class HotelRepositoryService {

	@Autowired
	HotelRepository hotelRepository;

	@Autowired
	EntityManager entityManager;

	public String bookProperty(Hotel htl) {

//		List<Hotel> list = new ArrayList<Hotel>();
//		list = hotelRepository.findAll();
//		
		StoredProcedureQuery query = entityManager.createStoredProcedureQuery("hotels");
		List<Hotel> list = query.getResultList();
		
		//query.execute();
		//list.add((Hotel) query.getResultList().get(0));
		System.out.println(list.size());
		System.out.println(list.get(0).getCity());

		// Hotel hotel = hotelRepository.save(htl);

	
		
		System.out.println("HOTEL");
		return "hotel";
		// return hotel.getGuestId() + " Booked a Property " + hotel.getPropertyId();
	}

}
