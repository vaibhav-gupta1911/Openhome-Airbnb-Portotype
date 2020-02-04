package com.openhome.service;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.StoredProcedureQuery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.openhome.entity.Hotel;
import com.openhome.repository.HotelRepository;
import com.openhome.repository.IHotelRepositoryCustom;

@Service
public class HotelRepositoryCustomService {// implements IHotelRepositoryCustom {

	@Autowired
	HotelRepository hotelRepository;
	
	@Autowired
	// @PersistenceContext
	private EntityManager em;

	// @Override
	public List<Hotel> getAllhotels() {
		// TODO Auto-generated method stub
		StoredProcedureQuery query = em.createNamedStoredProcedureQuery("getAllhotels");
		query.setParameter("x", 1);
		return query.getResultList();
	}

	public String bookProperty(Hotel htl) {
		Hotel hotel = hotelRepository.save(htl);
		System.out.println("HOTEL");
		return "hotel";
		// return hotel.getGuestId() + " Booked a Property " + hotel.getPropertyId();
	}
}
