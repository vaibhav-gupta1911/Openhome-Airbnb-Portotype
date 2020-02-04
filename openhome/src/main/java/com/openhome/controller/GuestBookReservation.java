package com.openhome.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.openhome.Utility.DateTimeUtility;
import com.openhome.entity.BlockedAvailability;
import com.openhome.entity.Booking;
import com.openhome.entity.Payment;
import com.openhome.entity.Property;
import com.openhome.entity.User;
import com.openhome.service.BlockedAvailabilityRepositoryService;
import com.openhome.service.BookingRepositoryService;
import com.openhome.service.PaymentRepositoryService;
import com.openhome.service.PropertyRepositoryService;
import com.openhome.service.UserRepositoryService;

@RestController
public class GuestBookReservation {

	@Autowired
	private BookingRepositoryService bookingService;

	@Autowired
	private PropertyRepositoryService propertyService;

	@Autowired
	private UserRepositoryService userService;

	@Autowired
	private UserController userController;

	@Autowired
	private PaymentRepositoryService paymentService;

	@Autowired
	private BlockedAvailabilityRepositoryService blockedAvailabilityService;

	private DateTimeUtility dateTimeUtility;

	@Autowired
	private PropertyController propertyController;

	@PostMapping("/bookProperty")
	public @ResponseBody Boolean postProperty(@RequestBody HashMap<String, String> map) throws ParseException {
		String start_date = ((String) map.get("start_date")).concat("T15:00:00.0000000Z");
		String checked_out_date = ((String) map.get("checkedOutDate")).concat("T11:00:00.0000000Z");
		String end_date = ((String) map.get("end_date")).concat("T11:00:00.0000000Z");
		Booking reserve = new Booking();
		Map<Object, Object> responseBody = new HashMap<>();
		System.out.println("Inside Book Property");
		System.out.println("map keys" + map.keySet());
		System.out.println("map values" + map.values());
		long guestId = Long.parseLong(map.get("guest_id"));
		long propertyId = Long.parseLong(map.get("property_id"));
		double weekdayPrice = Double.parseDouble(map.get("weekdayPrice"));
		double weekendPrice = Double.parseDouble(map.get("weekendPrice"));
		double parkingFee = Double.parseDouble(map.get("parkingFee"));
		Date startDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'.'S'Z'").parse(start_date);
		Date endDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'.'S'Z'").parse(end_date);
		Date checkedOutDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'.'S'Z'").parse(checked_out_date);
//		Date startDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'.'S'Z'").parse((String) map.get("start_date"));
//		Date endDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'.'S'Z'").parse((String) map.get("end_date"));
		double price = Double.parseDouble(map.get("price"));
		String status = (String) map.get("status");
		// Picture URLmap.get("status");

		System.out.println("HashMap::: " + map);
		reserve.setGuestId(guestId);
		reserve.setPropertyId(propertyId);
		reserve.setStartDate(startDate);
		reserve.setEndDate(endDate);
		reserve.setPrice(price);
		reserve.setStatus(status);
		reserve.setCheckedOutDate(checkedOutDate);
		reserve.setWeekdayPrice(weekdayPrice);
		reserve.setWeekendPrice(weekendPrice);
		reserve.setParkingFee(parkingFee);
		System.out.println("Booking Details: " + reserve);
		Boolean isAlreadyReserved = bookingService.checkIfAlreadyReserved(guestId, propertyId, startDate, endDate);
		if (!isAlreadyReserved) {
			Booking reservation = bookingService.bookProperty(reserve);

			BlockedAvailability blockedAvailability = new BlockedAvailability();
			blockedAvailability.setPropertyId(propertyId);
			blockedAvailability.setStartDate(startDate);
			blockedAvailability.setEndDate(endDate);
			blockedAvailability = blockedAvailabilityService.addBlockedDate(blockedAvailability);

			User user = userService.getUserById(guestId);
			String subject = "Property Booked!";
			String content = "You just booked a property!";
			userController.sendNotification(user, subject, content);

			Property property = propertyService.findPropertyById(propertyId);
			User host = userService.getUserById(property.getUserId());
			String subject1 = "Property Booked!";
			String content1 = "Your property has been booked!";
			userController.sendNotification(host, subject1, content1);

			// return responseBody.put("reservationDetails", reservation);;
			return true;
		}

		// return responseBody.put("reservationDetails", "reserved");
		return false;
	}

	@GetMapping("/getAllReservations/{userId}")
	public @ResponseBody Map<Object, Object> getAllHostReservations(HttpServletRequest request,
			HttpServletResponse response, @PathVariable(name = "userId") long userId) {
		Map<Object, Object> responseBody = new HashMap<>();

		System.out.println("===received user id  is === " + userId);
		try {
			List<Booking> bookings = bookingService.findAllReservedProperties(userId);
			System.out.println("properties" + bookings);
			List<Map<Object, Object>> propertyDetails = new ArrayList<Map<Object, Object>>();
			for (Booking booking : bookings) {
				System.out.println("=== fetched reserved properties of user are " + booking.toString());
				System.out.println("==== property id is ====" + booking.getPropertyId());
				long propertyId = booking.getPropertyId();
				Property property = new Property();
				property = propertyService.findPropertyById(propertyId);
				// i have to append the property thing to add the booking table details
				// in the frontend I have to change the way
				Map<Object, Object> propertyMap = new HashMap<>();
				propertyMap = propertyController.formProperty(property);
				propertyMap.put("bookingDetails", booking);
				propertyDetails.add(propertyMap);
			}
			responseBody.put("propertyDetails", propertyDetails);
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			responseBody.put("error", e.getMessage());
		}
		System.out.println("==== here===============================");
//		responseBody.put("propertyDetails", bookings);
		return responseBody;
	}

	@PostMapping("/cancelReservation")
	public @ResponseBody String cancelBooking(@RequestBody HashMap<String, String> map) throws ParseException {
		// Booking booking = new Booking();
		System.out.println("Inside cancel Booking Property");
		System.out.println("map keys" + map.keySet());
		System.out.println("map values" + map.values());
		long guestId = Long.parseLong(map.get("guestId"));
		long bookingId = Long.parseLong(map.get("bookingId"));
		long propertyId = Long.parseLong(map.get("propertyId"));
		double penalty = Double.parseDouble(map.get("penalty"));
		String status = (String) map.get("status");
		// booking.set

		String updatedStatus = bookingService.updateBookingByBookingId(bookingId, penalty, status);
		// Picture URLmap.get("status");
		System.out.println("updatedStatus : " + updatedStatus);

		if (penalty > 0) {
			// Payment on cancellation
			Payment p = new Payment();
			p.setEntryDate(DateTimeUtility.getCurrentTime());
			p.setAmount(penalty);
			p.setBookingid(bookingId);
			p.setPropertyid(propertyId);
			p.setOwner(guestId);
			p.setReason("CANCELLATION PENALTY");
			paymentService.makePaymentonCancelltion(p);
		}
		// Removing From Blocked Date table
		Booking booking = bookingService.findBookingById(bookingId);
		Map<Object, Object> blockedDate = new HashMap<Object, Object>();
		blockedDate.put("startDate", booking.getStartDate());
		blockedDate.put("endDate", booking.getEndDate());
		blockedDate.put("propertyId", propertyId);
		blockedAvailabilityService.changeBlockedDate(blockedDate);

		// Sending an Notification Email to Host
		Property property = propertyService.findPropertyById(propertyId);
		User host = userService.getUserById(property.getUserId());
		String subject = "Cancelled Reservation!";
		String content = "Guest just Cancelled a reservation for your property!";
		userController.sendNotification(host, subject, content);

		// Sending an Notification Email to Guest
		User guest = userService.getUserById(booking.getGuestId());
		subject = "Cancelled Reservation!";
		content = "You just cancelled your reservation!";
		userController.sendNotification(guest, subject, content);
		
		return "cancelled successfully";

	}

	@PostMapping("/cancelReservationByHost")
	public @ResponseBody String cancelBookingByHost(@RequestBody HashMap<String, String> map) throws ParseException {

		System.out.println("Inside cancel Booking Property");
		System.out.println("map keys" + map.keySet());
		System.out.println("map values" + map.values());

		long bookingId = Long.parseLong(map.get("bookingId"));
		long propertyId = Long.parseLong(map.get("propertyId"));
		long owner = Long.parseLong(map.get("owner"));
		Date checkOutDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'.'S'Z'").parse(map.get("checkOutDate"));
		double penalty = Double.parseDouble(map.get("penalty"));
		double refund = Double.parseDouble(map.get("refund"));
		String status = (String) map.get("status");

		String updatedStatus = bookingService.updateBookingByBookingIdHost(bookingId, penalty, refund, status,
				checkOutDate);
		System.out.println("updatedStatus : " + updatedStatus);

		Booking booking = bookingService.findBookingById(bookingId);

		if(penalty>0) {
			// Payment for penalty
			Payment p = new Payment();
			p.setEntryDate(DateTimeUtility.getCurrentTime());
			p.setAmount(penalty);
			p.setBookingid(bookingId);
			p.setPropertyid(propertyId);
			p.setOwner(owner);
			p.setReason("CANCELLATON PENALTY");
			paymentService.makePaymentonCancelltion(p);
		}
		

		if(refund>0) {
			// Payment for refund
			Payment guestRefund = new Payment();
			guestRefund.setEntryDate(DateTimeUtility.getCurrentTime());
			guestRefund.setAmount(refund);
			guestRefund.setBookingid(bookingId);
			guestRefund.setOwner(booking.getGuestId());
			guestRefund.setPropertyid(propertyId);
			guestRefund.setReason("REFUND");
			paymentService.makePaymentonCancelltion(guestRefund);
		}
		

		// Removing From Blocked Date table
		Map<Object, Object> blockedDate = new HashMap<Object, Object>();
		blockedDate.put("startDate", booking.getStartDate());
		blockedDate.put("endDate", booking.getEndDate());
		blockedDate.put("propertyId", propertyId);
		blockedAvailabilityService.changeBlockedDate(blockedDate);

		// Sending an Notification Email
		User host = userService.getUserById(owner);
		String subject = "Cancelled Reservation!";
		String content = "You just Cancelled a reservation!";
		userController.sendNotification(host, subject, content);

		User guest = userService.getUserById(booking.getGuestId());
		subject = "Refund Initiated!";
		content = "You are refunded because your booked property is cancelled by the host!";
		userController.sendNotification(guest, subject, content);

		return "cancelled successfully";
	}

	@PutMapping("/updateNoShowPenalty/{bookingId}")
	public @ResponseBody Map<Object, Object> updateNoShowPenalty(HttpServletResponse response,
			@RequestBody HashMap<Object, Object> map, @PathVariable(name = "bookingId") long bookingId)
			throws ParseException {
		System.out.println("Booking id fetched : " + bookingId);
		double noShowPenalty = Double.parseDouble(String.valueOf(map.get("noShowPenalty")));
		String status = (String) map.get("status");
		System.out.println(map.values());
		System.out.println("Checked IN Date before simpledatefromat entry: " + (String) map.get("checkedInDate"));
//		Date checkedInDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'.'S'Z'").parse((String) map.get("checkedInDate"));
//		Date checkedInDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
		System.out.println("Checked IN Date before database entry: " + new Date());
		// Date checkedInDate = (String)map.get("checkedInDate");
		Booking booking = bookingService.findBookingById(bookingId);
		booking.setNoShowPenalty(noShowPenalty);
		booking.setStatus(status);
		booking.setCheckedInDate(new Date());

		booking = bookingService.updateBooking(booking);
		Map<Object, Object> responseBody = new HashMap<>();
		responseBody.put("bookingDetails", formBooking(booking));
		try {
			System.out.println("Booking :::" + booking);
			responseBody.put("bookingDetails", formBooking(booking));
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			responseBody.put("error", e.getMessage());
		}

		User guest = userService.getUserById(booking.getGuestId());
		String subject = "No Show Penalty Charged!";
		String content = "You have been charged by no show penalty!";
		userController.sendNotification(guest, subject, content);

		Property property = propertyService.findPropertyById(booking.getPropertyId());
		User host = userService.getUserById(property.getUserId());
		String subject1 = "No Show!";
		String content1 = "Guest didn't show up for your booked property!";
		userController.sendNotification(host, subject1, content1);

		return responseBody;
	}

	@PostMapping("/updateNoShowWithTimeAdvancement")
	public @ResponseBody Map<Object, Object> updateNoShowWIthTimeAdvancement(@RequestBody HashMap<String, String> map)
			throws ParseException {
		System.out.println("updateNoShowWithTimeAdvancement api called..");
		System.out.println("map keys.." + map.keySet());
		System.out.println("map values.." + map.values());
		long userId = Long.parseLong(map.get("userId"));
		Date timeAdvanced = dateTimeUtility.getCurrentTime();
		System.out.println("time advanced date : " + timeAdvanced);
		List<Booking> AllbookingsOfUser = bookingService.findAllBookings(userId);
		Map<Object, Object> responseBody = new HashMap<>();
		for (Booking booking : AllbookingsOfUser) {

			Date startDate = booking.getStartDate();
			Date endDate = booking.getEndDate();
			Date nextDate3AM = DateUtils.addHours(startDate, 12);
			int hours = dateTimeUtility.getHoursDiff(startDate, timeAdvanced);
			System.out.println("hours :" + hours);
			double noShowPenalty = 0;
			// int hours = get hours between startdate and timeadvanced date
			if (hours < 12 && hours > 0) {
				System.out.println("if hours<12 block...");
				// let him checkin, set status = checkedin - api call
				// fetch it from enum
				booking.setStatus("checkedin");
				booking.setCheckedInDate(timeAdvanced);
				System.out.println("simple checkedin...check status in db");
				booking = bookingService.updateBooking(booking);

			}
//					else if(hours<12)
//					{
//						too early to checkin, let him wait- do nothing
//					}
			if (hours > 12) {
				System.out.println("if hours >12 block");
				// no show penalty here
				int days = dateTimeUtility.getDifferenceDays(startDate, endDate);
				System.out.println(" calculate days.. " + days);
				if (days == 2) {

					System.out.println("if days==2");
					boolean isWeekendStartDate = dateTimeUtility.isWeekend(startDate);
					if (isWeekendStartDate) {
						noShowPenalty = booking.getWeekendPrice() * 0.30;
					} else {
						noShowPenalty = booking.getWeekdayPrice() * 0.30;
					}
				} else if (days > 2) {

					System.out.println("if days>2");
					// 30% for that next day as well
					boolean isWeekendStartDate = dateTimeUtility.isWeekend(startDate);
					boolean isWeekendNextDate = dateTimeUtility.isWeekend(nextDate3AM);
					if (!isWeekendStartDate && !isWeekendStartDate) {
						System.out.println("case 1: both weekday ");
						noShowPenalty = booking.getWeekdayPrice() * 0.30 * 2;
					}

					else if (isWeekendStartDate && isWeekendNextDate) {
						System.out.println("case 2: both weekend ");
						noShowPenalty = booking.getWeekendPrice() * 0.30 * 2;
					} else {
						System.out.println("case 3: 1 weekday, 1 weekend ");
						noShowPenalty = (booking.getWeekdayPrice() + booking.getWeekendPrice()) * 0.30;
					}
				}
				// no show penalty api call
				booking.setNoShowPenalty(noShowPenalty);
				// fetch it from enum
				booking.setStatus("noshow");
				booking.setCheckedInDate(timeAdvanced);

				System.out.println("id, " + booking.getId() + " penalty " + booking.getNoShowPenalty() + " status "
						+ booking.getStatus());
				String updated = bookingService.updateBookingByBookingId(booking.getId(), booking.getNoShowPenalty(),
						booking.getStatus());
				try {
					System.out.println("Booking :::" + booking);
					responseBody.put("bookingDetails", formBooking(booking));
					responseBody.put("updated", updated);
				} catch (Exception e) {
					// response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
					responseBody.put("error", e.getMessage());
				}

			}

			// for checkout
			// if()

		}

		System.out.println("resposne body " + responseBody);
		return responseBody;
	}

	@PutMapping("/updateBookingCheckedIn/{bookingId}")
	public @ResponseBody Map<Object, Object> updateBookingCheckedIn(HttpServletResponse response,
			@RequestBody HashMap<Object, Object> map, @PathVariable(name = "bookingId") long bookingId)
			throws ParseException {
		System.out.println("Booking id fetched : " + bookingId);
		String status = (String) map.get("status");
		System.out.println(map.values());
		Date checkedInDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").parse((String) map.get("checkedInDate"));
		// Date checkedInDate = (String)map.get("checkedInDate");
		Booking booking = bookingService.findBookingById(bookingId);

		booking.setStatus(status);
		booking.setCheckedInDate(DateTimeUtility.getCurrentTime());

		booking = bookingService.updateBooking(booking);
		Map<Object, Object> responseBody = new HashMap<>();
		responseBody.put("bookingDetails", formBooking(booking));
		try {
			System.out.println("Booking :::" + booking);
			responseBody.put("bookingDetails", formBooking(booking));
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			responseBody.put("error", e.getMessage());
		}

		User guest = userService.getUserById(booking.getGuestId());
		String subject = "Checked In!";
		String content = "You just Checked in a property!";
		userController.sendNotification(guest, subject, content);

		Property property = propertyService.findPropertyById(booking.getPropertyId());
		User host = userService.getUserById(property.getUserId());
		String subject1 = "Checked In!";
		String content1 = "Guest Checked in to your property!";
		userController.sendNotification(host, subject1, content1);

		return responseBody;
	}

	@PutMapping("/updateBookingCheckedOut/{bookingId}")
	public @ResponseBody Map<Object, Object> updateBookingCheckedOut(HttpServletResponse response,
			@RequestBody HashMap<Object, Object> map, @PathVariable(name = "bookingId") long bookingId)
			throws ParseException {
		System.out.println("````````````````````````````Booking id fetched : " + bookingId);
		System.out.println("map from frontend `````````````" + map.toString());
		String status = (String) map.get("status");

		System.out.println("map" + map.values());
		Date checkedOutDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").parse((String) map.get("checkedOutDate"));
		// Date checkedInDate = (String)map.get("checkedInDate");
		Booking booking = bookingService.findBookingById(bookingId);
		System.out.println(
				"++++++++++++++++++++++++++++++++++CheckOut Date From Front END::::::::::::::" + checkedOutDate);
		booking.setStatus(status);
		booking.setCheckedOutDate(new Date());
		booking.setPenalty(Double.parseDouble((String) map.get("penalty")));
		booking = bookingService.updateBooking(booking);

		Map<Object, Object> responseBody = new HashMap<>();
		responseBody.put("bookingDetails", formBooking(booking));
		try {
			System.out.println("Booking :::" + booking);
			responseBody.put("bookingDetails", formBooking(booking));
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			responseBody.put("error", e.getMessage());
		}

		// Payment of the Penalty
		if (booking.getPenalty() > 0) {
			Payment p = new Payment();
			p.setEntryDate(DateTimeUtility.getCurrentTime());
			p.setAmount(booking.getPenalty());
			p.setBookingid(bookingId);
			p.setPropertyid(booking.getPropertyId());
			p.setOwner(booking.getGuestId());
			p.setReason("EARLY CHECKOUT");
			paymentService.makePaymentonCancelltion(p);
		}

		// Removing From Blocked Date table
		Date startDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").parse((String) map.get("startDate"));
		Date endDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").parse((String) map.get("endDate"));
		Map<Object, Object> blockedDate = new HashMap<Object, Object>();
		blockedDate.put("startDate", startDate);
		blockedDate.put("endDate", endDate);
		blockedDate.put("propertyId", Long.valueOf((Integer) map.get("propertyId")));
		blockedAvailabilityService.changeBlockedDate(blockedDate);

		User guest = userService.getUserById(booking.getGuestId());
		String subject = "Checked Out!";
		String content = "You just Checked out from a property!";
		userController.sendNotification(guest, subject, content);

		Property property = propertyService.findPropertyById(booking.getPropertyId());
		User host = userService.getUserById(property.getUserId());
		String subject1 = "Checked Out!";
		String content1 = "Guest Checked out from your property!";
		userController.sendNotification(host, subject1, content1);

		return responseBody;
	}

	@PutMapping("/updatePropertyRatingByHost/{bookingId}")
	public @ResponseBody Map<Object, Object> updatePropertyRatingByHost(HttpServletResponse response,
			@RequestBody HashMap<Object, Object> map, @PathVariable(name = "bookingId") long bookingId)
			throws ParseException {
		System.out.println("Booking id fetched : " + bookingId);
		int rating = ((int) map.get("hostRating"));
		System.out.println(map.values());
		Booking booking = bookingService.findBookingById(bookingId);
		booking.setHostrating(rating);

		booking = bookingService.updateBooking(booking);
		Map<Object, Object> responseBody = new HashMap<>();
		responseBody.put("bookingDetails", formBooking(booking));
		try {
			System.out.println("Booking :::" + booking);
			responseBody.put("bookingDetails", formBooking(booking));
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			responseBody.put("error", e.getMessage());
		}
		return responseBody;
	}

	@PutMapping("/updatePropertyRating/{bookingId}")
	public @ResponseBody Map<Object, Object> updatePropertyRating(HttpServletResponse response,
			@RequestBody HashMap<Object, Object> map, @PathVariable(name = "bookingId") long bookingId)
			throws ParseException {
		System.out.println("Booking id fetched : " + bookingId);
		int rating = ((int) map.get("rating"));
		System.out.println(map.values());
		Booking booking = bookingService.findBookingById(bookingId);
		booking.setRating(rating);

		booking = bookingService.updateBooking(booking);
		Map<Object, Object> responseBody = new HashMap<>();
		responseBody.put("bookingDetails", formBooking(booking));
		try {
			System.out.println("Booking :::" + booking);
			responseBody.put("bookingDetails", formBooking(booking));
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			responseBody.put("error", e.getMessage());
		}
		return responseBody;
	}

	@PutMapping("/updatePropertyReviewByGuest/{bookingId}")
	public @ResponseBody Map<Object, Object> updatePropertyReviewByGuest(HttpServletResponse response,
			@RequestBody HashMap<Object, Object> map, @PathVariable(name = "bookingId") long bookingId)
			throws ParseException {
		System.out.println("Booking id fetched : " + bookingId);
		String review = ((String) map.get("review"));
		System.out.println(map.values());
		Booking booking = bookingService.findBookingById(bookingId);
		booking.setReview(review);
		booking = bookingService.updateBooking(booking);
		Map<Object, Object> responseBody = new HashMap<>();
		responseBody.put("bookingDetails", formBooking(booking));
		try {
			System.out.println("Booking :::" + booking);
			responseBody.put("bookingDetails", formBooking(booking));
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			responseBody.put("error", e.getMessage());
		}
		return responseBody;
	}

	@PutMapping("/updatePropertyReviewByHost/{bookingId}")
	public @ResponseBody Map<Object, Object> updatePropertyReviewByHost(HttpServletResponse response,
			@RequestBody HashMap<Object, Object> map, @PathVariable(name = "bookingId") long bookingId)
			throws ParseException {
		System.out.println("Booking id fetched : " + bookingId);
		String review = ((String) map.get("hostReview"));
		System.out.println(map.values());
		Booking booking = bookingService.findBookingById(bookingId);
		booking.setHostreview(review);
		booking = bookingService.updateBooking(booking);
		Map<Object, Object> responseBody = new HashMap<>();
		responseBody.put("bookingDetails", formBooking(booking));
		try {
			System.out.println("Booking :::" + booking);
			responseBody.put("bookingDetails", formBooking(booking));
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			responseBody.put("error", e.getMessage());
		}
		return responseBody;
	}

	@GetMapping("/fetchAverageRating/{userId}")
	public @ResponseBody Map<Object, Object> fetchAverageRating(HttpServletRequest request,
			HttpServletResponse response, @PathVariable(name = "userId") long userId) {
		Map<Object, Object> responseBody = new HashMap<>();

		System.out.println("===received user id  is === " + userId);

		try {
			List<Property> properties = propertyService.findAllProperties(userId);
			if (properties != null || properties.size() > 0) {

				List<Booking> bookings = new ArrayList<Booking>();
				for (Property p : properties) {
					bookings.addAll(bookingService.findPropertyMapping(p.getId()));
				}
				System.out.println("all booking of particular property :: " + bookings);
				int totalRating = 0;
				int count = 0;
				for (Booking b : bookings) {
					if (b != null) {

						int rating = b.getRating();
						if (rating > 0) {
							totalRating += rating;
							count++;
						}
					}

				}
				int avgRating = 0;
				if (totalRating > 0)
					avgRating = totalRating / count;
				responseBody.put("avgRating", avgRating);
				responseBody.put("bookingDetails", bookings);
			}

		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			responseBody.put("error", e.getMessage());
		}
		System.out.println("==== here===============================");
//		responseBody.put("propertyDetails", bookings);
		return responseBody;
	}

	@GetMapping("/fetchGuestAverageRating/{userId}")
	public @ResponseBody Map<Object, Object> fetchGuestAverageRating(HttpServletRequest request,
			HttpServletResponse response, @PathVariable(name = "userId") long userId) {
		Map<Object, Object> responseBody = new HashMap<>();

		System.out.println("===received user id  is === " + userId);

		try {

			List<Booking> bookings = bookingService.findAllCheckedOutBookings(userId);

			System.out.println("all booking of particular user :: " + bookings);
			int totalRating = 0;
			int count = 0;
			for (Booking b : bookings) {
				if (b != null) {

					int rating = b.getHostrating();
					if (rating > 0) {
						totalRating += rating;
						count++;
					}
				}

			}
			int avgRating = 0;
			if (totalRating > 0)
				avgRating = totalRating / count;
			responseBody.put("avgRating", avgRating);
			responseBody.put("totalRating", count);
			responseBody.put("bookingDetails", bookings);

		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			responseBody.put("error", e.getMessage());
		}
		System.out.println("==== here===============================" + responseBody);
//		responseBody.put("propertyDetails", bookings);
		return responseBody;
	}

	public Map<Object, Object> formBooking(Booking booking) {
//		System.out.println("=== in form property===="+property.toString());
		Map<Object, Object> map = new HashMap<>();
		map.put("id", booking.getId());
		map.put("propertyId", booking.getPropertyId());
		map.put("guestId", booking.getGuestId());
		map.put("startDate", booking.getStartDate());
		map.put("endDate", booking.getEndDate());
		map.put("price", booking.getPrice());
		map.put("status", booking.getStatus());
		map.put("penalty", booking.getPenalty());
		map.put("noShowPenalty", booking.getNoShowPenalty());
		map.put("checkedInDate", booking.getCheckedInDate());
		map.put("rating", booking.getRating());
		map.put("review", booking.getReview());
		map.put("hostRating", booking.getHostrating());
		map.put("hostReview", booking.getHostreview());
		map.put("parkingFee", booking.getParkingFee());
		return map;
	}

}
