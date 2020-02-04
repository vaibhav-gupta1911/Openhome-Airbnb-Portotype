package com.openhome.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.openhome.entity.BlockedAvailability;
import com.openhome.entity.Booking;
import com.openhome.entity.Property;
import com.openhome.service.BlockedAvailabilityRepositoryService;
import com.openhome.service.BookingRepositoryService;
import com.openhome.service.PropertyRepositoryService;

@RestController
public class GuestController {
	//I made GuestBookReservation, we can remove this class.
//	
//	@Autowired
//	private BookingRepositoryService bookingService;
//	
//	@PostMapping("/bookProperty")
////	@RequestMapping(path="/bookProperty", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
//	public @ResponseBody String postProperty (@RequestBody HashMap<String, String> map) throws ParseException{
//        
//		Booking booking = new Booking();
//		
//		System.out.println("Inside Book Property");
//		long guestId = new Long(map.get("userId"));
//		long propertyId = new Long(map.get("propertyId"));
//		Date startDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'.'S'Z'").parse((String) map.get("startDate"));
//		Date endDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'.'S'Z'").parse((String) map.get("endDate"));
//		
//		System.out.println("HashMap::: " + map);
//		booking.setGuestId(guestId);
//		booking.setPropertyId(propertyId);
//		booking.setStartDate(startDate);
//		booking.setEndDate(endDate);
//		System.out.println("Booking Details: " + booking);
//        bookingService.bookProperty(booking);
//        return "Booked a property";
//    }
}
