package com.openhome.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;
import javax.persistence.StoredProcedureQuery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.openhome.entity.BlockedAvailability;
import com.openhome.entity.Property;
import com.openhome.entity.User;
import com.openhome.repository.BlockedAvailabilityRepository;

@Service
public class BlockedAvailabilityRepositoryService {

	@Autowired
	BlockedAvailabilityRepository blockedAvailabilityRepository;

	@Autowired
	EntityManager entityManager;

	public BlockedAvailability addBlockedDate(BlockedAvailability blockedAvailability) {
		BlockedAvailability blockedAvailability2 = blockedAvailabilityRepository.save(blockedAvailability);
		return blockedAvailability2;
	}
	
	@Transactional
	@Modifying
	public String changeBlockedDate(Map<Object, Object> map) throws ParseException {
//		Date startDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'.'S'Z'").parse((String)map.get("startDate"));
//		Date endDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'.'S'Z'").parse((String)map.get("endDate"));
//		Date checkedOutDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'.'S'Z'").parse((String)map.get("checkedOutDate"));
		long propertyId = (long)map.get("propertyId");
		System.out.println("start Date:" + (Date)map.get("startDate"));
		System.out.println("end Date:" + (Date)map.get("endDate"));
		System.out.println("PropertyId:" + propertyId);
		Query query = entityManager.createQuery("DELETE BlockedAvailability b WHERE b.startDate = :startDate and b.endDate = :endDate and b.propertyId = :propertyId");
		query.setParameter("startDate", (Date)map.get("startDate"));
		query.setParameter("endDate", (Date)map.get("endDate"));
		query.setParameter("propertyId", propertyId);
		String response=null;
		try {
			System.out.println("in delete block availability");
			response =  String.valueOf(query.executeUpdate());
			System.out.println("response===== "+response);
		}catch(NoResultException e) {
			System.out.println("error"+e);
		}
		System.out.println("response===== "+response);
		return "updated sucessfully";
	}
	

}
