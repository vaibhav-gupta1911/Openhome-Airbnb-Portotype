package com.openhome.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.util.*;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;
import javax.persistence.StoredProcedureQuery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.openhome.Utility.DateTimeUtility;
import com.openhome.controller.UserController;
import com.openhome.entity.Booking;
import com.openhome.entity.Hotel;
import com.openhome.entity.Payment;
import com.openhome.entity.Property;
import com.openhome.entity.User;
import com.openhome.repository.PropertyRepository;

@Service
@Transactional
public class PropertyRepositoryService {

	@Autowired
	PropertyRepository propertyRepository;
	
	@Autowired
	PaymentRepositoryService paymentService;

	@Autowired
	UserRepositoryService userService;
	
	@Autowired
	UserController userController;
	
	@Autowired
	EntityManager entityManager;

	public Property createProperty(Property property) {
		Property property2 = propertyRepository.save(property);
		return property2;
	}

	public Property updateProperty(Property property) {
		Property property2 = propertyRepository.save(property);
		return property2;
	}

	public Property findPropertyById(long propertyId) {
		Property property = propertyRepository.getOne(propertyId);
		System.out.println(":::" + property);
		return property;
	}

	public List<Property> getAvailability(Date startDate, Date endDate) {
		// TODO Auto-generated method stub
		StoredProcedureQuery query = entityManager.createNamedStoredProcedureQuery("getAvailability");

		query.setParameter("start", startDate);
		query.setParameter("end", endDate);
		return query.getResultList();
	}

	// public void findList() {

	// List<Property> list = new ArrayList<Property>();

	// StoredProcedureQuery query =
	// entityManager.createStoredProcedureQuery("availability");
	// try {
	// query.execute();

	// list.add((Property)query.getResultList().get(0));

	// System.out.println(list.size());
	// System.out.println(list.get(0).getCity());
	// } catch(NoResultException e) {

	// }

	public List<Property> findProperties(Map<Object, Object> map) throws ParseException {
		Date startDate = new SimpleDateFormat("yyyy-MM-dd").parse((String) map.get("startDate"));
		Date endDate = new SimpleDateFormat("yyyy-MM-dd").parse((String) map.get("endDate"));

		StoredProcedureQuery query = entityManager.createNamedStoredProcedureQuery("getAvailability");
		query.setParameter("pcity", map.get("city"));
//		System.out.println("zipcode" + (Integer)map.get("zipcode"));
//		if((Integer)map.get("zipcode")==null)
//			query.setParameter("pzipcode",(Integer)map.get("zipcode"));
		query.setParameter("pstartDate", startDate);
		query.setParameter("pendDate", endDate);
		System.out.println("In find Properties ");
		// OR
//		query.setParameter("psharingType", map.get("sharingType")); 
//		query.setParameter("ppropertyType",map.get("propertyType"));
//		query.setParameter("pminPrice", Double.valueOf(map.get("minPrice")));
//		query.setParameter("pmaxPrice", Double.valueOf(map.get("maxPrice")));
//		query.setParameter("pkeywords", map.get("keywords"));
//		query.setParameter("pinternet", Boolean.valueOf(map.get("internet")));

		return query.getResultList();
	}

	public List<Property> findList() {
		StoredProcedureQuery query = entityManager.createStoredProcedureQuery("availability");
		List<Property> list = (List<Property>) query.getResultList();
		System.out.println("List of Properties::" + list);
		return list;
	}

	public List<Property> findAllProperties(long hostId) {
		Query query = entityManager
				.createQuery("SELECT p FROM Property p WHERE p.userId = :userId AND p.isDeleted=false");
		query.setParameter("userId", hostId);
		System.out.println("Before Query:" + query);
		List<Property> properties = query.getResultList();
		return properties;
	}

	@Transactional
	public String deleteProperty(long userId, long propertyId) {
		Query query = entityManager
				.createQuery("UPDATE Property SET isDeleted = true Where id = :propertyId AND userId = :userId");
		query.setParameter("propertyId", propertyId);
		query.setParameter("userId", userId);
		String response = null;
		try {
			System.out.println("in delete property function");
			response = String.valueOf(query.executeUpdate());
			System.out.println("response===== " + response);
		} catch (NoResultException e) {
			System.out.println("error" + e);
		}
		System.out.println("response===== " + response);
		return response;
	}

	public List<Object> findAllGuestReservation2(long userId) {
		System.out.println("=== inside findAllHostReservation2");
		Query query = entityManager.createQuery(
				"SELECT DISTINCT p FROM Booking b JOIN Property p ON b.propertyId = p.id WHERE b.guestId =:userId");
		query.setParameter("userId", userId);
		List<Object> returnList = new ArrayList<>();
		List<Property> properties = new ArrayList<>();
		try {
			System.out.println("==###### query result ########" + query.getResultList());
			properties = query.getResultList();
			returnList.add(properties);
		} catch (Exception e) {
			System.out.println("=== exception is ===#" + e);
		}

		/*
		 * SELECT b.id as bid, b.guest_id, b.property_id, b.end_date, b.start_date FROM
		 * booking as b JOIN property as p ON b.property_id = p.id WHERE b.guest_id=9;
		 */

		Query queryBooking = entityManager.createQuery(
				"SELECT b FROM Booking b RIGHT JOIN Property p ON b.propertyId = p.id WHERE b.guestId =:userId");
		queryBooking.setParameter("userId", userId);
		List<Booking> bookings = new ArrayList<>();
		try {
			System.out.println("===== booking result````````");
			bookings = queryBooking.getResultList();
			System.out.println("booking is `````````````````" + bookings);
			returnList.add(bookings);
		} catch (Exception e) {
			System.out.println("=== exception is ===#####" + e);
		}

//		System.out.println("======properties===="+properties.toString());
		return returnList;

	}

	public List<Object> findAllHostBookings(long userId) {
		System.out.println("=== inside findAllHostReservation");
//		Query query = entityManager.createQuery(
//				"SELECT DISTINCT p FROM Property p RIGHT JOIN Booking b ON p.id=b.propertyId WHERE p.userId =:userId");
		Query query = entityManager.createQuery(
				"SELECT DISTINCT p FROM Property p RIGHT JOIN Booking b ON p.id=b.propertyId WHERE p.userId =:userId AND b.status NOT IN ('cancelled','checkedout','noshow')");
		query.setParameter("userId", userId);
		List<Object> returnList = new ArrayList<>();
		List<Property> properties = new ArrayList<>();
		try {
			System.out.println("==######3 query result ########" + query.getResultList());
			properties = query.getResultList();
			returnList.add(properties);
		} catch (Exception e) {
			System.out.println("=== exception is ===#" + e);
		}
//		Query queryBooking = entityManager.createQuery(
//				"SELECT b FROM Property p JOIN Booking b ON p.id=b.propertyId WHERE p.userId =:userId");
		Query queryBooking = entityManager.createQuery(
				"SELECT b FROM Property p JOIN Booking b ON p.id=b.propertyId WHERE p.userId =:userId AND b.status NOT IN ('cancelled','checkedout','noshow')");
		queryBooking.setParameter("userId", userId);
		List<Booking> bookings = new ArrayList<>();
		try {
			bookings = queryBooking.getResultList();
			returnList.add(bookings);
		} catch (Exception e) {
			System.out.println("=== exception is ===#" + e);
		}
		return returnList;

	}

	
	public List<Object> findHistoryOfHostBookings(long userId) {
		System.out.println("=== inside findAllHostReservation");
		Query query = entityManager.createQuery(
				"SELECT DISTINCT p FROM Property p RIGHT JOIN Booking b ON p.id=b.propertyId WHERE p.userId =:userId");
//		Query query = entityManager.createQuery(
//				"SELECT DISTINCT p FROM Property p RIGHT JOIN Booking b ON p.id=b.propertyId WHERE p.userId =:userId AND b.status NOT IN ('cancelled','checkedout','noshow')");
		query.setParameter("userId", userId);
		List<Object> returnList = new ArrayList<>();
		List<Property> properties = new ArrayList<>();
		try {
			System.out.println("==######3 query result ########" + query.getResultList());
			properties = query.getResultList();
			returnList.add(properties);
		} catch (Exception e) {
			System.out.println("=== exception is ===#" + e);
		}
		Query queryBooking = entityManager.createQuery(
				"SELECT b FROM Property p JOIN Booking b ON p.id=b.propertyId WHERE p.userId =:userId");
//		Query queryBooking = entityManager.createQuery(
//				"SELECT b FROM Property p JOIN Booking b ON p.id=b.propertyId WHERE p.userId =:userId AND b.status NOT IN ('cancelled','checkedout','noshow')");
		queryBooking.setParameter("userId", userId);
		List<Booking> bookings = new ArrayList<>();
		try {
			bookings = queryBooking.getResultList();
			returnList.add(bookings);
		} catch (Exception e) {
			System.out.println("=== exception is ===#" + e);
		}
		return returnList;

	}
	
	public String updateAllBooking(long propertyId) {
		System.out.println("=== inside findAllHostReservation");
		Query query = entityManager.createQuery(
				"SELECT b FROM Booking b WHERE b.propertyId= :propertyId and status NOT IN ('cancelled', 'checkedout', 'noshow')");
		query.setParameter("propertyId", propertyId);
		System.out.println("Property ID:::::" + propertyId);
		List<Booking> bookings = new ArrayList<>();
		try {
			System.out.println("*************Booking Deatails from Particular Property***** " + query.getResultList());
			bookings = query.getResultList();
		} catch (Exception e) {
			System.out.println("************Error in getting Booking**********");
		}
		Iterator<Booking> iter = bookings.iterator();
		Map<Booking, Double> penalties = new HashMap<>();
		while (iter.hasNext()) {
			StoredProcedureQuery sq = entityManager.createNamedStoredProcedureQuery("updateAvailability");
			Booking booking = iter.next();
			System.out.println("Booking Id: " + booking.getId());
			sq.setParameter("pstartDate", booking.getStartDate());
			sq.setParameter("pendDate", booking.getEndDate());
			sq.setParameter("bookingid", booking.getId());
			sq.setParameter("price", booking.getPrice());
			sq.setParameter("pid", propertyId);

			Double penalty = (Double) sq.getOutputParameterValue("penalty");
			if(penalty>0) {
				Property property = findPropertyById(booking.getPropertyId());
				User host = userService.getUserById(property.getUserId());
				//Payment for penalty
				Payment p = new Payment();
				p.setEntryDate(DateTimeUtility.getCurrentTime());
				p.setAmount(penalty);
				p.setBookingid(booking.getId());
				p.setPropertyid(propertyId);
				p.setOwner(host.getId());
				p.setReason("CANCELLATON PENALTY");
				
				User guest = userService.getUserById(booking.getGuestId());
				//Payment for refund		
				Payment guestRefund = new Payment();
				guestRefund.setEntryDate(DateTimeUtility.getCurrentTime());
				guestRefund.setAmount(penalty);
				guestRefund.setBookingid(booking.getId());
				guestRefund.setOwner(booking.getGuestId());
				guestRefund.setPropertyid(propertyId);
				guestRefund.setReason("COMPANSATION");

				paymentService.makePaymentonCancelltion(p);
				paymentService.makePaymentonCancelltion(guestRefund);
				
				//Email host on Cancellation
				String subject = "Cancelled Reservation!";
				String content = "You just Cancelled a reservation!";
				userController.sendNotification(host, subject, content);
				
				//Email guest on Cancellation
				subject = "Refund Initiated!";
				content = "You are refunded because your booked property is cancelled by the host!";
				userController.sendNotification(guest, subject, content);
			}
			try {
				System.out.println("Query Result:::::::::::::::" + penalty);
				// long penalty = (long) sq.getSingleResult();
				penalties.put(booking, penalty);
			} catch (Exception e) {
				System.out.println("Error in Getting Data from Procedure " + e);
			}
		}
		System.out.println("Map Values:::::::::::::::::" + penalties.values());

		return "Updated";
	}

	public boolean checkConflict(HashMap<Object, Object> map, long propertyId) {
		System.out.println("=== inside checkConflict");
		Query query = entityManager.createQuery(
				"SELECT b FROM Booking b WHERE b.propertyId= :propertyId and status NOT IN ('cancelled', 'checkedout', 'noshow')");
		query.setParameter("propertyId", propertyId);
		System.out.println("Property ID:::::" + propertyId);
		List<Booking> bookings = new ArrayList<>();
		try {
			System.out.println("*************Booking Deatails from Particular Property***** " + query.getResultList());
			bookings = query.getResultList();
		} catch (Exception e) {
			System.out.println("************Error in getting Booking**********");
		}
		Iterator<Booking> iter = bookings.iterator();
		Map<Booking, Double> penalties = new HashMap<>();
		while (iter.hasNext()) {
			System.out.println("::::::::Inside Loop:::::");
			StoredProcedureQuery sq = entityManager.createNamedStoredProcedureQuery("checkConflict");
			System.out.println("After AStored Proceduree:::");
			Booking booking = iter.next();
			System.out.println("Map Value::::" + map.toString());
			sq.setParameter("pstartDate", booking.getStartDate());
			sq.setParameter("pendDate", booking.getEndDate());
			sq.setParameter("monday", Long.valueOf((Integer)map.get("monday")));
			sq.setParameter("tuesday", Long.valueOf((Integer)map.get("tuesday")));
			sq.setParameter("wednesday", Long.valueOf((Integer)map.get("wednesday")));
			sq.setParameter("thursday", Long.valueOf((Integer)map.get("thursday")));
			sq.setParameter("friday", Long.valueOf((Integer)map.get("friday")));
			sq.setParameter("saturday", Long.valueOf((Integer)map.get("saturday")));
			sq.setParameter("sunday", Long.valueOf((Integer)map.get("sunday")));
			
			System.out.println("Before Conflict::::");
			if ((Long) sq.getOutputParameterValue("conflict") == 1) {
				System.out.println("Conflict is set to true");
				return true;

			}
		}
		System.out.println("Conflict is set to false");
		return false;
	}
	
	public void updateOwnerPenaltyOnDelete(long propertyId) {
		System.out.println("=== inside update Owner Penalty and Booking Status");
		Query query = entityManager.createQuery(
				"SELECT b FROM Booking b WHERE b.propertyId= :propertyId and status NOT IN ('cancelled', 'checkedout', 'noshow')");
		query.setParameter("propertyId", propertyId);
		System.out.println("Property ID:::::" + propertyId);
		
		List<Booking> bookings = new ArrayList<>();
		try {
			System.out.println("*************Booking Deatails from Particular Property***** " + query.getResultList());
			bookings = query.getResultList();
		} catch (Exception e) {
			System.out.println("************Error in getting Booking**********");
		}
		Iterator<Booking> iter = bookings.iterator();
		
		while (iter.hasNext()) {
			System.out.println("::::::::Inside Loop:::::");
			Booking booking = iter.next();
			System.out.println("Booking Detail "+ booking);
			Date startDate = booking.getStartDate();
			Date currentDate = DateTimeUtility.getCurrentTime();	
			int hours = DateTimeUtility.getHoursDiff(startDate, currentDate);
			
			double ownerPenalty= 0;
			if(Math.abs(hours)<=7*24) {
				ownerPenalty = booking.getPrice() * 0.15;
				System.out.println("Penaltyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy:::::"+ ownerPenalty);
				
			}	
			Query updatePenalty = entityManager
					.createQuery("UPDATE Booking SET status='cancelled', ownerPenalty= :ownerPenalty WHERE id = :bookingId");
			updatePenalty.setParameter("bookingId", booking.getId());
			updatePenalty.setParameter("ownerPenalty", ownerPenalty);
			String response = null;
			try {
				System.out.println("in owner penalty function");
				response = String.valueOf(updatePenalty.executeUpdate());
				System.out.println("response===== " + response);
			} catch (NoResultException e) {
				System.out.println("error" + e);
			}
			System.out.println("response===== " + response);
			
			if(ownerPenalty>0) {
				Property property = findPropertyById(booking.getPropertyId());
				User host = userService.getUserById(property.getUserId());
				//Payment for penalty
				Payment p = new Payment();
				p.setEntryDate(DateTimeUtility.getCurrentTime());
				p.setAmount(ownerPenalty);
				p.setBookingid(booking.getId());
				p.setPropertyid(propertyId);
				p.setOwner(host.getId());
				p.setReason("CANCELLATON PENALTY");
				
				User guest = userService.getUserById(booking.getGuestId());
				//Payment for refund		
				Payment guestRefund = new Payment();
				guestRefund.setEntryDate(DateTimeUtility.getCurrentTime());
				guestRefund.setAmount(ownerPenalty);
				guestRefund.setBookingid(booking.getId());
				guestRefund.setOwner(booking.getGuestId());
				guestRefund.setPropertyid(propertyId);
				guestRefund.setReason("COMPANSATION");

				paymentService.makePaymentonCancelltion(p);
				paymentService.makePaymentonCancelltion(guestRefund);
				
				//Email host on Cancellation
				String subject = "Cancelled Reservation!";
				String content = "You just Cancelled a reservation!";
				userController.sendNotification(host, subject, content);
				
				//Email guest on Cancellation
				subject = "Refund Initiated!";
				content = "You are refunded because your booked property is cancelled by the host!";
				userController.sendNotification(guest, subject, content);
			}
			
			
		}
		System.out.println("Updated Owner Penalty and Cancelled Reservation Successfully");
	}
	
	
	public boolean checkConflictOnDelete(long propertyId) {
		System.out.println("=== inside checkConflictOnDelete");
		Query query = entityManager.createQuery(
				"SELECT b FROM Booking b WHERE b.propertyId= :propertyId and status NOT IN ('cancelled', 'checkedout', 'noshow')");
		query.setParameter("propertyId", propertyId);
		System.out.println("Property ID:::::" + propertyId);
		List<Booking> bookings = new ArrayList<>();
		try {
			System.out.println("*************Booking Deatails from Particular Property***** " + query.getResultList());
			bookings = query.getResultList();
		} catch (Exception e) {
			System.out.println("************Error in getting Booking**********");
		}
		Iterator<Booking> iter = bookings.iterator();
		Map<Booking, Double> penalties = new HashMap<>();
//		Calendar startDate = Calendar.getInstance();
//		Calendar currentDate = Calendar.getInstance();
		
		while (iter.hasNext()) {
			System.out.println("::::::::Inside Loop:::::");
			Booking booking = iter.next();
			Date startDate = booking.getStartDate();
			Date currentDate = DateTimeUtility.getCurrentTime();
			int hours = DateTimeUtility.getHoursDiff(startDate, currentDate);
			
			if(Math.abs(hours)<=7*24) {
				return true;
			}		
		}
		System.out.println("Conflict is set to false");
		return false;
	}
	
	

}
