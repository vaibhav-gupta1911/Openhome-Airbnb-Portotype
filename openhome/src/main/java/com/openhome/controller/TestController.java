package com.openhome.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.openhome.entity.Hotel;
import com.openhome.entity.Property;
import com.openhome.repository.HotelRepository;
import com.openhome.service.AvailabilityRepositoryService;
import com.openhome.service.BookingRepositoryService;
import com.openhome.service.HotelRepositoryCustomService;
import com.openhome.service.HotelRepositoryService;
import com.openhome.service.PropertyRepositoryService;

@RestController
public class TestController {

	@Autowired
	// private HotelRepositoryService proprepo;
	private HotelRepositoryCustomService h;
	
	@Autowired
	private PropertyRepositoryService p;

//	@PostMapping("/world")
//	public @ResponseBody List<Property>  postProperty (@RequestBody HashMap<String, String> map) throws ParseException{
//		
//		System.out.println("request arrived key..."+ map.keySet());
//		System.out.println("request arrived value..."+ map.values());
//     
//		Date startDate = new SimpleDateFormat("yyyy-MM-dd").parse((String) map.get("startDate"));
//		Date endDate = new SimpleDateFormat("yyyy-MM-dd").parse((String) map.get("endDate"));
//	@PostMapping("/world")
//	public @ResponseBody List<Property>  postProperty (@RequestBody HashMap<String, String> map) throws ParseException{
//		
//		System.out.println("request arrived key..."+ map.keySet());
//		System.out.println("request arrived value..."+ map.values());
//     
////		Date startDate = new SimpleDateFormat("yyyy-MM-dd").parse((String) map.get("startDate"));
////		Date endDate = new SimpleDateFormat("yyyy-MM-dd").parse((String) map.get("endDate"));
////	@PostMapping("/world")
////	public @ResponseBody List<Property>  postProperty (@RequestBody HashMap<String, String> map) throws ParseException{
////     
//////		Date startDate = new SimpleDateFormat("yyyy-MM-dd").parse((String) map.get("startDate"));
//////		Date endDate = new SimpleDateFormat("yyyy-MM-dd").parse((String) map.get("endDate"));
//////		
////		//2019-11-21T15:00:00.234Z
////		
//////		List<Property> target = p.findProperties(map); //p.getAvailability(startDate, endDate);
////		//System.out.println(target.get(0));
////		
//////		return target;
////	}

	@RequestMapping(value = "/world", method = RequestMethod.GET)
	public String test() throws ParseException {

//		Hotel x = new Hotel();
//		x.setCity("city");
//		x.setState("state");
//		x.setId(2);
//		x.setFullName("name");
//
//		h.bookProperty(x);

//		List<Hotel> target = h.getAllhotels();
//		System.out.println(target.get(0).getCity());
//		System.out.println(target.size());
		
//		Date startDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'.'S'Z'").parse((String) map.get("startDate"));
//		Date endDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'.'S'Z'").parse((String) map.get("endDate"));
//		
		Date startDate = new SimpleDateFormat("yyyy-MM-dd").parse("2019-11-12");
		Date endDate = new SimpleDateFormat("yyyy-MM-dd").parse("2019-11-20");
		
		
		//2019-11-21T15:00:00.234Z
		
		List<Property> target = p.getAvailability(startDate, endDate);
//		System.out.println(target.get(0));
//		System.out.println(target.size());
		
		return "HELLO Nehas...";
	}

}

