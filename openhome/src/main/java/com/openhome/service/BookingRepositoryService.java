package com.openhome.service;

import java.text.ParseException;
import java.time.Duration;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;
import javax.persistence.StoredProcedureQuery;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.openhome.Utility.DateTimeUtility;
import com.openhome.controller.UserController;
import com.openhome.entity.Booking;
import com.openhome.entity.Hotel;
import com.openhome.entity.Payment;
import com.openhome.entity.Property;
import com.openhome.entity.User;
import com.openhome.repository.BookingRepository;
import com.openhome.repository.PaymentRepository;
import com.openhome.repository.PropertyRepository;

@Service
@Transactional
public class BookingRepositoryService {
	
	@Autowired
	BookingRepository bookingRepository;
	
	@Autowired
	EntityManager entityManager;
	
	@Autowired
	PaymentRepository paymentRepository;

	@Autowired
	BlockedAvailabilityRepositoryService blockedAvailabilityRepositoryService;
	
	@Autowired
	UserController userController;
	
	@Autowired
	UserRepositoryService userService;
	
	@Autowired
	PropertyRepositoryService propertyService;
	
	@Autowired
	PaymentRepositoryService paymentService;
	
	public Booking bookProperty(Booking booking) {
		Booking book = bookingRepository.save(booking); 
		System.out.println( book.getGuestId() + " Reserved a Property " + book.getPropertyId());
		return book;
	}
	
	public Booking findBookingById(long bookingId) {
		Booking booking = bookingRepository.getOne(bookingId);
		System.out.println(":::" + booking);
		return booking;
	} 
	
	public Booking updateBooking(Booking booking) {
		Booking booking2 = bookingRepository.save(booking);
		return booking2;
	}

	public List<Booking> findPropertyMapping(long propertyId) {
		Query query = entityManager.createQuery("SELECT b FROM Booking b WHERE b.propertyId = :propertyId");
		query.setParameter("propertyId", propertyId);
		System.out.println(":::" + query);
		List<Booking> booking = query.getResultList();
		System.out.println("reservedHomes bookings are"+booking);
		return booking;
	} 

	
	public List<Booking> findAllReservedProperties(long userId) {
		Query query = entityManager.createQuery("SELECT b FROM Booking b WHERE b.guestId = :userId and status='reserved'");
		query.setParameter("userId", userId);
		System.out.println("Before Query:" + query);
		List<Booking> reservedHomes = query.getResultList();
		System.out.println("reserved properties are"+reservedHomes);
		return reservedHomes;
	}
	

	public List<Booking> findAllBookings(long userId) {
		Query query = entityManager.createQuery("SELECT b FROM Booking b WHERE b.guestId = :userId");
		query.setParameter("userId", userId);
		System.out.println("Before Query:" + query);
		List<Booking> booking = query.getResultList();
		System.out.println("reservedHomes bookings are"+booking);
		return booking;
	}
	
	//waiting for the query from vaibhav
//	public String findAlreadyReservedPropertyForUser(Booking booking) {
//		Query query = entityManager.createQuery("SELECT b FROM Booking b WHERE b.guest_id = " + booking.getGuestId() + "AND b.property_id = " + booking.getPropertyId()+
//		""
//				
//				);
//		query.setParameter("email", email);
//		System.out.println("Before Query:"+query);
//		User user=null;
//		try {
//			user = (User) query.getSingleResult();
//		} catch(Exception e) {
//			System.out.println(" exception thrown is : "+ e);	
//		}
//		return user;
//	}
	
	@Transactional
	public String updateBookingByBookingId(long bookingId, double penalty, String status)
	{
		Query query = entityManager.createQuery("UPDATE Booking SET status =:status, penalty =:penalty Where id = :bookingId");
		query.setParameter("bookingId", bookingId);
		query.setParameter("penalty", penalty);
		query.setParameter("status", status);
		String response = null;
		try {
			System.out.println("in update booking function");
			response =  String.valueOf(query.executeUpdate());
			System.out.println("response===== "+response);
		}catch(NoResultException e) {
			System.out.println("error"+e);
		}
		System.out.println("response===== "+response);
		return "updated sucessfully";
	}
	
	public List<Booking> findReservedPropertiesOfAllUsers() {
		// status is reserved and end date is smaller than or equal to current date from DateTimeUtils
		Query query = entityManager.createQuery("SELECT b FROM Booking b WHERE b.status='reserved' AND b.startDate <= :currentDate");
		query.setParameter("currentDate", DateTimeUtility.getCurrentTime());
		System.out.println("Before Query:" + query);
		List<Booking> reservedBookings = query.getResultList();
		System.out.println("reserved properties are"+reservedBookings);
		return reservedBookings;
	}

	public void emailForCheckedInProperties() {
		// status is reserved and end date is smaller than or equal to current date from DateTimeUtils
		Query query = entityManager.createQuery("SELECT b FROM Booking b WHERE ((status = 'paid' OR status='checkedin') OR (status = 'cancelled' AND refund>0 AND checkedInDate IS NOT NULL)) AND b.endDate <= :currentDate");
		query.setParameter("currentDate", DateTimeUtility.getCurrentTime());
		List<Booking> bookings = query.getResultList();
		for (Booking booking : bookings) {
			
			//email to guest
			User guest = userService.getUserById(booking.getGuestId());
			String subject = "Checked Out!";
			String content = "You just Checked out from a property!";
			userController.sendNotification(guest, subject, content);
			
			//email to host
			Property property = propertyService.findPropertyById(booking.getPropertyId());
			User host = userService.getUserById(property.getUserId());
			String subject1 = "Checked Out!";
			String content1 = "Guest Checked out from your property!";
			userController.sendNotification(host, subject1, content1);
			
		}
		
		
	}
	
	public void findCheckedInPropertiesOfAllUsers() {
		// status is reserved and end date is smaller than or equal to current date from DateTimeUtils
		Query query = entityManager.createQuery("UPDATE Booking b SET b.status='checkedout' WHERE ((status = 'paid' OR status='checkedin') OR (status = 'cancelled' AND refund>0 AND checkedInDate IS NOT NULL)) AND b.endDate <= :currentDate");
		query.setParameter("currentDate", DateTimeUtility.getCurrentTime());
		String response = null;
		try {
			System.out.println("in update booking function");
			response =  String.valueOf(query.executeUpdate());
			System.out.println("response===== "+response);
		}catch(NoResultException e) {
			System.out.println("error"+e);
		}
		System.out.println("response===== "+response);
//		return "updated sucessfully";
	}
	
	@Transactional
	public String updateBookingByBookingIdHost(long bookingId, double penalty, double refund ,String status,Date checkOutDate)
	{
		Query query = entityManager.createQuery("UPDATE Booking SET status =:status, ownerPenalty =:penalty, refund =:refund, checkedOutDate =:checkOutDate Where id = :bookingId");
		query.setParameter("bookingId", bookingId);
		query.setParameter("penalty", penalty);
		query.setParameter("status", status);
		query.setParameter("refund", refund);
		query.setParameter("checkOutDate", checkOutDate);
		String response = null;
		try {
			System.out.println("in update booking function");
			response =  String.valueOf(query.executeUpdate());
			System.out.println("response===== "+response);
		}catch(NoResultException e) {
			System.out.println("error"+e);
		}
		System.out.println("response===== "+response);
		return "updated sucessfully";
	}
	
	public boolean checkIfAlreadyReserved(long guestId, long propertyId, Date startDate, Date endDate)
	{
		System.out.println("Check if property is already reserved for guest" + guestId + " and property id "+propertyId );
		Query query = entityManager.createQuery("SELECT b FROM Booking b WHERE b.guestId = :guestId and propertyId=:propertyId and startDate=:startDate and endDate=:endDate and status='reserved'");
		query.setParameter("guestId", guestId);
		query.setParameter("propertyId", propertyId);
		query.setParameter("startDate", startDate);
		query.setParameter("endDate", endDate);
		System.out.println("Before Query:" + query);
		List<Booking> booking= query.getResultList();
		if(booking.size() >0 )
			return true;
		return false;
	}
	
	public void updateNoShow()
	{
		Query query = entityManager.createQuery("SELECT b FROM Booking b Where status = 'reserved' AND startDate<=:checkedInDate");
		query.setParameter("checkedInDate", new Date());
		Calendar currentTime = Calendar.getInstance();
		currentTime.setTime(new Date());
		currentTime.add(Calendar.HOUR_OF_DAY, -12);
		query.setParameter("checkedInDate", currentTime.getTime());
		
		
		Calendar startDate = Calendar.getInstance();
		Calendar endDate = Calendar.getInstance();
		List<Booking> bookings = query.getResultList();
		for (Booking booking : bookings) {
			startDate.setTime(booking.getStartDate());
			endDate.setTime(booking.getEndDate());
			startDate.set(Calendar.HOUR_OF_DAY, 0);
			startDate.set(Calendar.MINUTE, 0);
			startDate.set(Calendar.SECOND, 0);
			startDate.set(Calendar.MILLISECOND, 0);
			
			endDate.set(Calendar.HOUR_OF_DAY, 0);
			endDate.set(Calendar.MINUTE, 0);
			endDate.set(Calendar.SECOND, 0);
			endDate.set(Calendar.MILLISECOND, 0);
			
			System.out.println("Start Date:::" + startDate);
			System.out.println("End Date:::" + endDate);
			
			System.out.println(startDate.get(Calendar.DAY_OF_WEEK)%7);
			System.out.println(endDate.get(Calendar.DAY_OF_WEEK)%7);
			
			int days = (int) Duration.between(startDate.toInstant(), endDate.toInstant()).toDays();
			System.out.println("Start Date compared to end Date"+ days);
			
			int startDay = startDate.get(Calendar.DAY_OF_WEEK);
			double weekdayPrice = booking.getWeekdayPrice();
			double weekendPrice = booking.getWeekendPrice();
			System.out.println("weekdayprice:"+ weekdayPrice);
			System.out.println("weekendprice:"+ weekdayPrice);
			double penalty=0;
			if(days>1) {
				if(startDay>1 && startDay !=6) {
					penalty = (weekdayPrice)*0.3*2;
					System.out.println("Penalty: " + (weekdayPrice)*0.3*2 );
				} else if(startDay==6) {
					penalty = (weekdayPrice+weekendPrice)*0.3;
					System.out.println("Penalty:: " + (weekdayPrice+weekendPrice)*0.3);
				} else {
					penalty = (weekendPrice)*0.3*2;
					System.out.println("Penalty::: " + (weekendPrice)*0.3*2 );
				}
			} else {
				if(startDay > 1) {
					penalty = (weekdayPrice)*0.3;
					System.out.println("Penalty:::: " + (weekdayPrice)*0.3 );
				} else {
					penalty = (weekendPrice)*0.3;
					System.out.println("Penalty::::: " + (weekendPrice)*0.3 );
				}
			}
			Query updateNoShow = entityManager.createQuery("UPDATE Booking SET noShowPenalty=:penalty, status='noshow' WHERE id=:bookingId");
			updateNoShow.setParameter("bookingId", booking.getId());
			updateNoShow.setParameter("penalty", penalty);
			String response = null;
			try {
				System.out.println("in update no show function");
				response =  String.valueOf(updateNoShow.executeUpdate());
				System.out.println("response===== "+response);
			}catch(NoResultException e) {
				System.out.println("error"+e);
			}
			System.out.println("response===== "+response);
			

			//Updating BLocked Availability Table
			Map<Object, Object> map = new HashMap<>();
			map.put("propertyId", booking.getPropertyId());
			map.put("startDate", booking.getStartDate());
			map.put("endDate", booking.getEndDate());
			String updateBlockResponse = null;
			try {
				updateBlockResponse = blockedAvailabilityRepositoryService.changeBlockedDate(map);
			} catch (Exception e1) {
				// TODO Auto-generated catch block
				System.out.println("error"+e1);
			}
			System.out.println("Update BLock Response:::" + updateBlockResponse);
			
			//Payment on No Show
			Payment p = new Payment();
			p.setEntryDate(DateTimeUtility.getCurrentTime());
			p.setAmount(penalty);
			p.setBookingid(booking.getId());
			p.setPropertyid(booking.getPropertyId());
			p.setOwner(booking.getGuestId());
			p.setReason("NO SHOW PENALTY");
			paymentService.makePaymentonCancelltion(p);
			
			//email guest
			User guest = userService.getUserById(booking.getGuestId());
			String subject = "No Show Penalty Charged!";
			String content = "You have been charged by no show penalty!";
			userController.sendNotification(guest, subject, content);
			
			//email to host
			Property property = propertyService.findPropertyById(booking.getPropertyId());
			User host = userService.getUserById(property.getUserId());
			String subject1 = "No Show!";
			String content1 = "Guest didn't show up for your booked property!";
			userController.sendNotification(host, subject1, content1);
			
		}
	}
	
	public void emailForAutoCheckout() {
		// status is reserved and end date is smaller than or equal to current date from DateTimeUtils

		Query query = entityManager.createQuery("SELECT b FROM Booking b WHERE ((status = 'paid' OR status='checkedin') OR (status = 'cancelled' AND refund>0 AND checkedInDate IS NOT NULL)) AND checkedOutDate<=:checkedOutDate");
		Calendar currentTime = Calendar.getInstance();
		currentTime.setTime(new Date());
		query.setParameter("checkedOutDate", currentTime.getTime());
		
		List<Booking> bookings = query.getResultList();
		for (Booking booking : bookings) {
			
			//email to guest
			User guest = userService.getUserById(booking.getGuestId());
			String subject = "Checked Out!";
			String content = "You just Checked out from a property!";
			userController.sendNotification(guest, subject, content);
			
			//email to host
			Property property = propertyService.findPropertyById(booking.getPropertyId());
			User host = userService.getUserById(property.getUserId());
			String subject1 = "Checked Out!";
			String content1 = "Guest Checked out from your property!";
			userController.sendNotification(host, subject1, content1);
			
		}
		
		
	}
	
	public void updateCheckout()
	{
		emailForAutoCheckout();
		Query query = entityManager.createQuery("UPDATE Booking SET status='checkedout' Where ((status = 'paid' OR status='checkedin') OR (status = 'cancelled' AND refund>0 AND checkedInDate IS NOT NULL)) AND checkedOutDate<=:checkedOutDate");
		
		Calendar currentTime = Calendar.getInstance();
		currentTime.setTime(new Date());
		query.setParameter("checkedOutDate", currentTime.getTime());
		
		
		
		String response = null;
		try {
			System.out.println("in update no show function");
			response =  String.valueOf(query.executeUpdate());
			System.out.println("response===== "+response);
		}catch(NoResultException e) {
			System.out.println("error"+e);
		}
		System.out.println("response===== "+response);
		
	}
	
	public List<Booking> findAllCheckedOutBookings(long userId) {
		Query query = entityManager.createQuery("SELECT b FROM Booking b WHERE b.guestId = :userId and status='checkedout'");
		query.setParameter("userId", userId);
		System.out.println("Before Query:" + query);
		List<Booking> booking = query.getResultList();
		System.out.println("reservedHomes bookings are"+booking);
		return booking;
	}
	
}
