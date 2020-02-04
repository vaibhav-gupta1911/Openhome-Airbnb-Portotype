
package com.openhome.controller;

import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.UUID;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
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
import com.openhome.entity.Booking;
import com.openhome.entity.Property;
import com.openhome.entity.User;
import com.openhome.entity.Verification;
import com.openhome.service.PropertyRepositoryService;
import com.openhome.service.UserRepositoryService;

@RestController
public class UserController {

	@Autowired
	private UserRepositoryService userService;

	@Autowired
	private PropertyRepositoryService propertyService;

	@Autowired
	private PropertyController propertyController;

	@Autowired
	BookingController bookingController;

	public static final long HOUR = 3600 * 1000;

	@PostMapping("/register")
//	@RequestMapping(path = "/register", method = RequestMethod.POST)
	public @ResponseBody Map<Object, Object> addNewUser(@RequestBody User user) {
		Map<Object, Object> responseBody = new HashMap<>();
		System.out.println("User in addNewUser " + user.getEmail());
		System.out.println("==== user is" + user);
		System.out.println("=== user is ======" + user.toString());

		String email = user.getEmail();
		System.out.println("trying to get user email: " + user.getEmail());
		if (email.endsWith("@sjsu.edu"))
			user.setType("Host");
		else
			user.setType("Guest");

		User temp = userService.findUserByEmail(email);
		if (temp == null) {
			userService.createUser(user);
			sendVerificationToken(user);
			responseBody.put("userDetails", formUser(user));
		} else
//			return "User is already registered";
			responseBody.put("error", "User is already registration");
//		return "Saved";
		return responseBody;
	}

	@PostMapping("/signIn")
	public @ResponseBody Map<Object, Object> signInUser(HttpServletRequest request, HttpServletResponse response,
			@RequestBody HashMap<Object, Object> map) {
//		System.out.println("User email and password");
		Map<Object, Object> responseBody = new HashMap<>();
		try {

			User user = new User();
			String email = (String) map.get("email");
			String password = (String) map.get("password");
			System.out.println(" ==== received email is =====: " + email);
			System.out.println(" ==== received password is ====: " + password);
			user = userService.signIn(email, password);
			responseBody.put("userDetails", formUser(user));

		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_OK);
			responseBody.put("error", "email or password is incorrect");
			System.out.println("e is ======" + e);
//			responseBody.put("errorfrom ",e);
		}
		return responseBody;

	}

	public Map<Object, Object> formUser(User user) {
		Map<Object, Object> map = new HashMap<>();
		map.put("id", user.getId());
		map.put("email", user.getEmail());
		map.put("firstName", user.getFirstName());
		map.put("lastName", user.getLastName());
		map.put("isVerified", user.getIsVerified());
		map.put("password", user.getPassword());
		map.put("type", user.getType());

//		System.out.println("==== user formed is ===="+map);

		return map;
	}

	public String sendVerificationToken(User user) {

		// get all properties
		long userId = user.getId();
		String email = user.getEmail();
		String token = UUID.randomUUID().toString();
		Date createdDate = new Date();
		Date expiryDate = new Date(createdDate.getTime() + 24 * HOUR);
		Verification verification = new Verification();

		// set all properties of verification
		verification.setUserId(userId);
		verification.setToken(token);
		verification.setCreatedDate(createdDate);
		verification.setExpiryDate(expiryDate);

		System.out.println("trying to send email to : " + email);
		userService.sendVerification(user, verification);

		return "Verification Email Sent";
	}

	@PutMapping("/removeProperty")
	public @ResponseBody Map<Object, Object> removeProperty(HttpServletRequest request, HttpServletResponse response,
			@RequestBody HashMap<Object, Object> map) {
		Map<Object, Object> responseBody = new HashMap<>();
		System.out.println(
				"user id " + map.get("userId") + "is deleting the property with property id" + map.get("propertyId"));
		try {
			String property;
			long userId = Long.valueOf((String) map.get("userId"));
			long propertyId = Long.valueOf((Integer) map.get("propertyId"));
			System.out.println("propertyId is" + propertyId + "user Id is " + userId);
			
			propertyService.updateOwnerPenaltyOnDelete(propertyId);
			System.out.println("Update Owner Penalty is performed");
			
			property = propertyService.deleteProperty(userId, propertyId);
			System.out.println("Response of the delete property"+ property);
			
			if (property.equals("1")) {
				responseBody.put("message", "property deleted successfully");
			} else {
				responseBody.put("message", "property could not be deleted");
			}
//			responseBody.put("message",property);

		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			System.out.println("error is:========= " + e);
			responseBody.put("error", e.getMessage());

		}
		User user = userService.getUserById(Long.valueOf((String) map.get("userId")));
		String subject = "Property Removed!"; 
		String content = "You just deleted a Property!";
		sendNotification(user, subject, content);

		return responseBody;
	}

	@GetMapping("/getUser/{email:.+}")
	public @ResponseBody Map<Object, Object> getUser(HttpServletRequest request, HttpServletResponse response,
			@PathVariable(name = "email") String email) {
		Map<Object, Object> responseBody = new HashMap<>();
		System.out.println("===received email is === " + email);
		try {
			User user = new User();
			user = userService.findUserByEmail(email);
			System.out.println("=== fetched user is ===" + formUser(user));
//			if(user==null) {
//				System.out.println("the user is not found in the db");
//			}else {
//				System.out.println("the user is found");
//			}
			responseBody.put("userDetails", formUser(user));

		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_OK);
			System.out.println("=== e is ===" + e);
			responseBody.put("error", "no user found");
		}
		return responseBody;
	}

	@GetMapping("/getAllGuestReservations2/{userId}")
	public @ResponseBody Map<Object, Object> getAllGuestReservations2(HttpServletRequest request,
			HttpServletResponse response, @PathVariable(name = "userId") long userId) {
		Map<Object, Object> responseBody = new HashMap<>();
		System.out.println("===received user id  is === " + userId);
		System.out.println("==== getCurrentTime  ===="+ DateTimeUtility.getCurrentTime());

		// setting the current  time
		Date currentTime = DateTimeUtility.getCurrentTime();
		
		System.out.println("==== new Date time is ===="+ new Date());
		try {

			List<Property> properties = (List<Property>) propertyService.findAllGuestReservation2(userId).get(0);
			List<Booking> bookings = (List<Booking>) propertyService.findAllGuestReservation2(userId).get(1);

			List<Map<Object, Object>> propertyDetails = new ArrayList<Map<Object, Object>>();
			Map<Object, Object> innerMapToAddBooking = new HashMap<Object, Object>();
			innerMapToAddBooking.put("pastReservationDetails", "");
			innerMapToAddBooking.put("presentReservationDetails", "");
			innerMapToAddBooking.put("futureResevationDetails", "");

			Map<String, ArrayList<Map<Object, Object>>> tryMap = new HashMap<String, ArrayList<Map<Object, Object>>>();
//			tryMap.put("pastReservationDetails", []);
//			tryMap.put("presentReservationDetails", null);
//			tryMap.put("futureResevationDetails", null);

			for (Booking booking : bookings) {
				long propertyId = booking.getPropertyId();
				List<Map<Object, Object>> innerBookingDetails = new ArrayList<Map<Object, Object>>();

				List<Map<Object, Object>> innerPresentBookingDetails = new ArrayList<Map<Object, Object>>();
				ArrayList<Map<Object, Object>> innerFutureBookingDetails = new ArrayList<Map<Object, Object>>();
				List<Map<Object, Object>> innerPastBookingDetails = new ArrayList<Map<Object, Object>>();

				for (Property property : properties) {
					if (property.getId() == propertyId) {
						System.out.println("==== mathced property=== with propertyId" + propertyId);
						System.out.println("==== mathced property.getId() === with propertyId" + property.getId());
						System.out.println("!!!!!!!!!!!!!1 mathched property details "
								+ propertyController.formProperty(property).toString());
						System.out.println(
								"!!!!!!!!!!!!!! matched booking details " + bookingController.formBooking(booking));

						// now that the property is present let's check if it is present reservation ,
						// future or past

						// For future Reservations
						// get the booking start date and check if it is greater than current system
						// date
						if (booking.getStartDate().after(currentTime) && booking.getEndDate().after(currentTime)
								&& (booking.getStatus().equals("reserved"))  ) {
							System.out.println(
									"=== reservation is in future ===" + bookingController.formBooking(booking));
							System.out.println("=== the property is ===" + propertyController.formProperty(property));
							innerFutureBookingDetails.add(propertyController.formProperty(property));
							// get from the map and then append
							ArrayList<Map<Object, Object>> innerFutureBookingDetailsTemp = new ArrayList<Map<Object, Object>>();
							Map<Object, Object> addBookingToProp = new HashMap<>();
							if (tryMap.containsKey("futureReservationDetails")) {
//								innerFutureBookingDetailsTemp = tryMap.get("futureReservationDetails");
////								System.out.println("``````=== innerFutureBookingDetailsTemp````"+innerFutureBookingDetailsTemp.toString());
//								innerFutureBookingDetailsTemp.add(propertyController.formProperty(property));
//								innerFutureBookingDetailsTemp.add(bookingController.formBooking(booking));
//								System.out.println("``````=== innerFutureBookingDetailsTemp````"+innerFutureBookingDetailsTemp.toString());
//								tryMap.put("futureReservationDetails",innerFutureBookingDetailsTemp);
//								System.out.println("`````~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
//								System.out.println("~~~~~ tryMap `````");
//								System.out.println(tryMap.toString());
//								System.out.println("`````~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

								System.out.println(
										"===== ````````````try propertyController.formProperty(property)`````````````` ===="
												+ propertyController.formProperty(property).toString());
								innerFutureBookingDetailsTemp = tryMap.get("futureReservationDetails");
								addBookingToProp = propertyController.formProperty(property);
								addBookingToProp.put("bookingDetails", bookingController.formBooking(booking));
								innerFutureBookingDetailsTemp.add(addBookingToProp);
//								innerFutureBookingDetailsTemp.add(bookingController.formBooking(booking));
								tryMap.put("futureReservationDetails", innerFutureBookingDetailsTemp);
								System.out.println("===========");

							} else {

								System.out.println("=======");
								addBookingToProp = propertyController.formProperty(property);
								addBookingToProp.put("bookingDetails", bookingController.formBooking(booking));
								innerFutureBookingDetailsTemp.add(addBookingToProp);
								tryMap.put("futureReservationDetails", innerFutureBookingDetailsTemp);

								System.out.println("=======");

//								innerFutureBookingDetailsTemp.add(propertyController.formProperty(property));
//								tryMap.put("futureReservationDetails",innerFutureBookingDetailsTemp);
//								System.out.println("``````=== innerFutureBookingDetailsTemp````"+innerFutureBookingDetailsTemp.toString());
//								System.out.println("`````**************************************");
//								System.out.println("~~~~~ tryMap `````");
//								System.out.println(tryMap.toString());
//								System.out.println("`````**************************************");
							}
//							innerMapToAddBooking.put("futureResevationDetails", innerFutureBookingDetails);
						}

//						 For past Reservations
//						 both the start date and end date should be smaller than the current system date
						if ((booking.getStartDate().before(currentTime) && booking.getEndDate().before(currentTime))
								|| (booking.getStatus().equals("checkedout"))
								|| (booking.getStatus().equals("cancelled"))
								|| (booking.getStatus().equals("noshow"))) {
//						if((booking.getStartDate().before(new Date()) && booking.getEndDate().before(new Date()))) {
							System.out
									.println("=== reservation is in past ===" + bookingController.formBooking(booking));
							System.out.println("=== the property is ===" + propertyController.formProperty(property));
							System.out.println("===== booking status ======" + booking.getStatus());
							innerPastBookingDetails.add(propertyController.formProperty(property));

							ArrayList<Map<Object, Object>> innerPastBookingDetailsTemp = new ArrayList<Map<Object, Object>>();
							Map<Object, Object> addBookingToProp = new HashMap<>();
							if (tryMap.containsKey("pastReservationDetails")) {
//								innerPastBookingDetailsTemp = tryMap.get("pastReservationDetails");
////								System.out.println("``````=== innerFutureBookingDetailsTemp````"+innerFutureBookingDetailsTemp.toString());
//								innerPastBookingDetailsTemp.add(propertyController.formProperty(property));
////								System.out.println("``````=== innerFutureBookingDetailsTemp````"+innerFutureBookingDetailsTemp.toString());
//								tryMap.put("pastReservationDetails",innerPastBookingDetailsTemp);
//								System.out.println("`````~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
//								System.out.println("~~~~~ tryMap `````");
//								System.out.println(tryMap.toString());
//								System.out.println("`````~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
//								
								System.out.println("=====");
								innerPastBookingDetailsTemp = tryMap.get("pastReservationDetails");
								addBookingToProp = propertyController.formProperty(property);
								addBookingToProp.put("bookingDetails", bookingController.formBooking(booking));
								innerPastBookingDetailsTemp.add(addBookingToProp);
								tryMap.put("pastReservationDetails", innerPastBookingDetailsTemp);
								System.out.println("=====");

							} else {

								System.out.println("=======");
								addBookingToProp = propertyController.formProperty(property);
								addBookingToProp.put("bookingDetails", bookingController.formBooking(booking));
								innerPastBookingDetailsTemp.add(addBookingToProp);
								tryMap.put("pastReservationDetails", innerPastBookingDetailsTemp);

								System.out.println("=======");

//								innerPastBookingDetailsTemp.add(propertyController.formProperty(property));
//								tryMap.put("pastReservationDetails",innerPastBookingDetailsTemp);
//								System.out.println("``````=== innerFutureBookingDetailsTemp````"+innerPastBookingDetailsTemp.toString());
//								System.out.println("`````**************************************");
//								System.out.println("~~~~~ tryMap `````");
//								System.out.println(tryMap.toString());
//								System.out.println("`````**************************************");
							}

//							innerMapToAddBooking.put("pastReservationDetails", innerFutureBookingDetails);

						}
//						// For present Reservations
//						// the start date should be smaller than the current system's date or start date is equal to current date
//						// and 
//						// the end date should be greater than the current system's date or end date is equal to current date
//						if((booking.getStartDate().equals(new Date())||booking.getStartDate().before(new Date())
//								&&
//								((booking.getEndDate().after(new Date()))
//										|| (booking.getEndDate().equals(new Date())))) && 
//								(!(booking.getStatus().equals("checkedout"))||(!booking.getStatus().equals("cancelled")))){
//						if((booking.getStartDate().equals(new Date())||booking.getStartDate().before(new Date())
//								&&((booking.getEndDate().after(new Date()))||(booking.getEndDate().equals(new Date())))) ) {

						if ( ( ( booking.getStartDate().equals(currentTime) || booking.getStartDate().before(currentTime) ) 
								&& ( booking.getEndDate().equals(currentTime) || booking.getEndDate().after(currentTime) ) ) 
								&& ( !(booking.getStatus().equals("checkedout")) && !(booking.getStatus().equals("cancelled")) && !(booking.getStatus().equals("noshow")) ) ) {
							System.out.println(
									"=== reservation is in present ===" + bookingController.formBooking(booking));
							System.out.println("=== the property is ===" + propertyController.formProperty(property));
							System.out.println("===== booking status ======" + booking.getStatus());
							innerPresentBookingDetails.add(propertyController.formProperty(property));

							ArrayList<Map<Object, Object>> innerPresentBookingDetailsTemp = new ArrayList<Map<Object, Object>>();
							Map<Object, Object> addBookingToProp = new HashMap<>();
							if (tryMap.containsKey("presentReservationsDetails")) {
//								innerPresentBookingDetailsTemp = tryMap.get("pastReservationDetails");
////								System.out.println("``````=== innerFutureBookingDetailsTemp````"+innerFutureBookingDetailsTemp.toString());
//								innerPresentBookingDetailsTemp.add(propertyController.formProperty(property));
////								System.out.println("``````=== innerFutureBookingDetailsTemp````"+innerFutureBookingDetailsTemp.toString());
//								tryMap.put("presentReservationsDetails",innerPresentBookingDetailsTemp);
//								System.out.println("`````~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
//								System.out.println("~~~~~ tryMap `````");
//								System.out.println(tryMap.toString());
//								System.out.println("`````~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

								System.out.println("===if===");
								innerPresentBookingDetailsTemp = tryMap.get("presentReservationsDetails");
								addBookingToProp = propertyController.formProperty(property);
								addBookingToProp.put("bookingDetails", bookingController.formBooking(booking));
								innerPresentBookingDetailsTemp.add(addBookingToProp);
								tryMap.put("presentReservationsDetails", innerPresentBookingDetailsTemp);
								System.out.println("======");

							} else {

								System.out.println("====else===");
								addBookingToProp = propertyController.formProperty(property);
								addBookingToProp.put("bookingDetails", bookingController.formBooking(booking));
								innerPresentBookingDetailsTemp.add(addBookingToProp);
								tryMap.put("presentReservationsDetails", innerPresentBookingDetailsTemp);

								System.out.println("=======");

//								innerPresentBookingDetailsTemp.add(propertyController.formProperty(property));
//								tryMap.put("presentReservationsDetails",innerPresentBookingDetailsTemp);
//								System.out.println("``````=== innerFutureBookingDetailsTemp````"+innerPresentBookingDetailsTemp.toString());
//								System.out.println("`````**************************************");
//								System.out.println("~~~~~ tryMap `````");
//								System.out.println(tryMap.toString());
//								System.out.println("`````**************************************");
							}
//							innerMapToAddBooking.put("presentReservationsDetails", innerFutureBookingDetails);
						}

					} else {
						System.out.println("======================");
						System.out.println("`````````` property Id in booking table " + propertyId);
						System.out.println("`````````property id in property table " + property.getId());
					}
				}
				System.out.println("===== innerBookingDetails ===" + innerBookingDetails.toString());

				// add the booked list in the formed proertyMap
//				innerMapToAddBooking = propertyController.formBookedProperty(property);

//				innerMapToAddBooking.put("pastReservationDetails", innerPastBookingDetails);
//				innerMapToAddBooking.put("presentReservationDetails", innerPresentBookingDetails);
//				innerMapToAddBooking.put("futureResevationDetails", innerFutureBookingDetails);

				System.out.println("=== ```````````````current system time in millis" + currentTime);
				propertyDetails.add(innerMapToAddBooking);
			}

//			responseBody.put("propertyDetails", propertyDetails);
			responseBody.put("propertyDetails", tryMap);

		} catch (Exception e) {
			System.out.println("=== exeception thrown " + e);
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			responseBody.put("error", e.getMessage());
		}
		return responseBody;
	}

	@GetMapping("/getAllHostBookings/{userId}")
	public @ResponseBody Map<Object, Object> getAllHostBookings(HttpServletRequest request,
			HttpServletResponse response, @PathVariable(name = "userId") long userId) {
		Map<Object, Object> responseBody = new HashMap<>();
		System.out.println("==== received user id is ====" + userId);
		System.out.println("==== getCurrentTime  ===="+ DateTimeUtility.getCurrentTime());

		// setting the current  time
		Date currentTime = DateTimeUtility.getCurrentTime();
		
		System.out.println("==== new Date time is ===="+ new Date());
		try {
			List<Property> properties = (List<Property>) propertyService.findAllHostBookings(userId).get(0);
			List<Booking> bookings = (List<Booking>) propertyService.findAllHostBookings(userId).get(1);

			List<Map<Object, Object>> propertyDetails = new ArrayList<Map<Object, Object>>();
			for (Property property : properties) {

				long propertyId = property.getId();
				List<Map<Object, Object>> innerBookingDetails = new ArrayList<Map<Object, Object>>();

				List<Map<Object, Object>> innerPresentBookingDetails = new ArrayList<Map<Object, Object>>();
				List<Map<Object, Object>> innerFutureBookingDetails = new ArrayList<Map<Object, Object>>();
				List<Map<Object, Object>> innerPastBookingDetails = new ArrayList<Map<Object, Object>>();

				for (Booking booking : bookings) {
					if (booking.getPropertyId() == propertyId) {
						innerBookingDetails.add(bookingController.formBooking(booking));

						// For future bookings
						// both the start and end date should be greater than the system's date
						System.out.println("-----------------------------\n");
						if (booking.getStartDate().after(currentTime) && booking.getEndDate().after(currentTime)) {
							System.out.println("=== booking is in future ===" + bookingController.formBooking(booking));
							innerFutureBookingDetails.add(bookingController.formBooking(booking));
						}

						// For past bookings
						// both the start and end date should be smaller than the system's date
//						if (booking.getStartDate().before(currentTime) && booking.getEndDate().before(currentTime)) {
						if (booking.getStartDate().before(currentTime) && booking.getCheckedOutDate().before(currentTime)) {
							System.out.println("=== booking is in past ====" + bookingController.formBooking(booking));
							innerPastBookingDetails.add(bookingController.formBooking(booking));
						}

						// for current bookings
						// the start date should be smaller than the current system's date or start date
						// is equal to current date
						// and
						// the end date should be greater than the current system's date or end date is
						// equal to current date
						if ((booking.getStartDate().equals(currentTime) || booking.getStartDate().before(currentTime)
								&& ((booking.getEndDate().after(currentTime))
										|| (booking.getEndDate().equals(currentTime))))) {
							System.out
									.println("=== booking is in present ===" + bookingController.formBooking(booking));
							innerPresentBookingDetails.add(bookingController.formBooking(booking));
						}
						System.out.println("\n-----------------------------");

					}
				}
				System.out.println("===== innerBookingDetails ===" + innerBookingDetails.toString());
				Map<Object, Object> innerMapToAddBooking = new HashMap<Object, Object>();

				// add the booked list in the formed proertyMap
				innerMapToAddBooking = propertyController.formBookedProperty(property);

				innerMapToAddBooking.put("pastBookingDetails", innerPastBookingDetails);
				innerMapToAddBooking.put("presentBookingDetails", innerPresentBookingDetails);
				innerMapToAddBooking.put("futureBookingDetails", innerFutureBookingDetails);

				System.out.println("=== ```````````````current system time in millis" + currentTime);
				propertyDetails.add(innerMapToAddBooking);

			}
//			System.out.println("==== propertyDetails ===="+propertyDetails);
			if (!propertyDetails.isEmpty()) {
				responseBody.put("propertyDetails", propertyDetails);
			} else {
				responseBody.put("property", "no bookings for this user's posted properties");
			}

		} catch (Exception e) {
			System.out.println("=== exception is e" + e);
			responseBody.put("error", e);
		}

		return responseBody;
	}
	
	@GetMapping("/getHistoryOfHostBookings/{userId}")
	public @ResponseBody Map<Object, Object> getHistoryOfHostBookings(HttpServletRequest request,
			HttpServletResponse response, @PathVariable(name = "userId") long userId) {
		Map<Object, Object> responseBody = new HashMap<>();
		System.out.println("==== received user id is ====" + userId);
		System.out.println("==== getCurrentTime  ===="+ DateTimeUtility.getCurrentTime());

		// setting the current  time
		Date currentTime = DateTimeUtility.getCurrentTime();
		
		System.out.println("==== new Date time is ===="+ new Date());
		try {
			List<Property> properties = (List<Property>) propertyService.findHistoryOfHostBookings(userId).get(0);
			List<Booking> bookings = (List<Booking>) propertyService.findHistoryOfHostBookings(userId).get(1);

			List<Map<Object, Object>> propertyDetails = new ArrayList<Map<Object, Object>>();
			for (Property property : properties) {

				long propertyId = property.getId();
				List<Map<Object, Object>> innerBookingDetails = new ArrayList<Map<Object, Object>>();

				List<Map<Object, Object>> innerPresentBookingDetails = new ArrayList<Map<Object, Object>>();
				List<Map<Object, Object>> innerFutureBookingDetails = new ArrayList<Map<Object, Object>>();
				List<Map<Object, Object>> innerPastBookingDetails = new ArrayList<Map<Object, Object>>();

				for (Booking booking : bookings) {
					if (booking.getPropertyId() == propertyId) {
						System.out.println("-------------Start Date::::" + booking.getStartDate());
						System.out.println("-------------ChekcedOut Date::::" + booking.getCheckedOutDate());
						innerBookingDetails.add(bookingController.formBooking(booking));

						// For future bookings
						// both the start and end date should be greater than the system's date
						System.out.println("-----------------------------\n");
						if (booking.getStartDate().after(currentTime) && booking.getCheckedOutDate().after(currentTime)) {
							System.out.println("=== booking is in future ===" + bookingController.formBooking(booking));
							innerFutureBookingDetails.add(bookingController.formBooking(booking));
						}

						// For past bookings
						// both the start and end date should be smaller than the system's date
//						if (booking.getStartDate().before(currentTime) && booking.getEndDate().before(currentTime)) {
						if (booking.getStartDate().before(currentTime) && booking.getCheckedOutDate().before(currentTime)) {
							System.out.println("=== booking is in past ====" + bookingController.formBooking(booking));
							innerPastBookingDetails.add(bookingController.formBooking(booking));
						}

						// for current bookings
						// the start date should be smaller than the current system's date or start date
						// is equal to current date
						// and
						// the end date should be greater than the current system's date or end date is
						// equal to current date
						if ((booking.getStartDate().equals(currentTime) || booking.getStartDate().before(currentTime))
								&& ((booking.getCheckedOutDate().after(currentTime))
										|| (booking.getCheckedOutDate().equals(currentTime)))) {
							System.out
									.println("=== booking is in present ===" + bookingController.formBooking(booking));
							innerPresentBookingDetails.add(bookingController.formBooking(booking));
						}
						System.out.println("\n-----------------------------");

					}
				}
				System.out.println("===== innerBookingDetails ===" + innerBookingDetails.toString());
				Map<Object, Object> innerMapToAddBooking = new HashMap<Object, Object>();

				// add the booked list in the formed proertyMap
				innerMapToAddBooking = propertyController.formBookedProperty(property);

				innerMapToAddBooking.put("pastBookingDetails", innerPastBookingDetails);
				innerMapToAddBooking.put("presentBookingDetails", innerPresentBookingDetails);
				innerMapToAddBooking.put("futureBookingDetails", innerFutureBookingDetails);

				System.out.println("=== ```````````````current system time in millis" + currentTime);
				propertyDetails.add(innerMapToAddBooking);

			}
			System.out.println("==== propertyDetails ===="+propertyDetails);
			if (!propertyDetails.isEmpty()) {
				responseBody.put("propertyDetails", propertyDetails);
			} else {
				responseBody.put("property", "no bookings for this user's posted properties");
			}

		} catch (Exception e) {
			System.out.println("=== exception is e" + e);
			responseBody.put("error", e);
		}

		return responseBody;
	}

	public void sendNotification(User user, String subject, String content) {
		final String username = "openhome275@gmail.com";
		final String password = "openhome123";
		
//		final String username = "openhackservice@gmail.com";
//		final String password = "openhack123";

		Properties prop = new Properties();
		prop.put("mail.smtp.host", "smtp.gmail.com");
		prop.put("mail.smtp.port", "587");
		prop.put("mail.smtp.auth", "true");
		prop.put("mail.smtp.starttls.enable", "true"); // TLS

		Session session = Session.getInstance(prop, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(username, password);
			}
		});

		try {

			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress(username));
			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(user.getEmail()));
			message.setSubject(subject);

			message.setContent("<p>Hi " + user.getFirstName() + " " + user.getLastName() + "!<br/><br/>" + content
					+ "<p><br/><br/>Regeards,<br/>OpenHome Team.", "text/html");

			Transport.send(message);

			System.out.println("Done");

		} catch (MessagingException e) {
			e.printStackTrace();
		}
	}

}
