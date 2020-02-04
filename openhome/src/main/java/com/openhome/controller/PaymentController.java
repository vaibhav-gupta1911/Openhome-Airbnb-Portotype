package com.openhome.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.openhome.entity.Card;
import com.openhome.entity.Payment;
import com.openhome.entity.Property;
import com.openhome.entity.User;
import com.openhome.service.PaymentRepositoryService;
import com.openhome.service.UserRepositoryService;

@RestController
public class PaymentController {

	@Autowired
	private PaymentRepositoryService p;

	@Autowired
	private UserController userController;
	
	@Autowired
	private UserRepositoryService userService;
	
	@PostMapping("/payments")
	public @ResponseBody String  makePayment (@RequestBody Payment map) throws ParseException{
		
		System.out.println("Test");
		System.out.println(map);
		
		p.makePayment(map);
		long userId = map.getOwner();
		
		User user = userService.getUserById(userId);
		String subject = "Payment Confirmation!"; 
		String content = "You paid for your booked property!";
		userController.sendNotification(user, subject, content);
		
		return "Success Payment!!";
	}
	
	@PostMapping("/hostbillingsummary")
	public @ResponseBody List<Object>  hostBillingSummary (@RequestBody HashMap<String,String> map) throws ParseException{
		
		System.out.println("Inside hostBillingSummary");
		long hostId = new Long(map.get("userId"));
		
		return p.gethostBillingSummary(hostId);
	}
	
	@PostMapping("/guestbillingsummary")
	public @ResponseBody List<Object>  BilguestlingSummary (@RequestBody HashMap<String,String> map) throws ParseException{
		
		System.out.println("Inside guestbillingsummary");
		long guestid = new Long(map.get("userId"));
		return p.getguestBillingSummary(guestid);
	}
	
	@PostMapping("/addcard")
	public @ResponseBody String addCard (@RequestBody Card map) throws ParseException{
		System.out.println("Add card request");
		p.addcard(map);
		
		long userId = map.getOwner();
		User user = userService.getUserById(userId);
		String subject = "Payment Method Registered!"; 
		String content = "You just registered a payment method!";
		userController.sendNotification(user, subject, content);
		
		return "Success Add Card!!";
	}
	 
	@PostMapping("/deletecard")
	public @ResponseBody String deleteCard (@RequestBody Card map) throws ParseException{
		System.out.println("Delete card request");
		p.deletecard(map);
		return "Success Delete Card!!";
	}
	
//	@PostMapping("/payments")
//	public @ResponseBody String  makePayment (@RequestBody HashMap<String,String> map) throws ParseException{
//		
//		System.out.println("Test");
//		System.out.println(map);
//		
//		//p.makePayment(map);
//		return "Success Payment!!";
//	}
	
	@RequestMapping(value = "/cards/{user}", method = RequestMethod.GET)
	public Card getCards(@PathVariable(name="user") long user) {
		System.out.println("=== received user is ==="+user);
		Card c = p.findCardsByUser(user);
		
		return c;
	}

}
