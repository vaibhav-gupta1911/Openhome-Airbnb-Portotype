package com.openhome.Utility;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.openhome.controller.BookingController;
import com.openhome.controller.PropertyController;
import com.openhome.controller.UserController;
import com.openhome.entity.Booking;
import com.openhome.entity.Property;
import com.openhome.service.PropertyRepositoryService;
import com.openhome.service.UserRepositoryService;

@RestController 
public class BookingUtility {

//	@Autowired
//	private UserRepositoryService userService;
//
//	@Autowired
//	private PropertyRepositoryService propertyService;
//
//	@Autowired
//	private PropertyController propertyController;
//
//	@Autowired
//	BookingController bookingController;
	
//	public static void getAllBookingsByUser2(long userid) {
//		UserController c = new UserController();
//		Map<Object, Object> responseBody = new HashMap<>();
//		
//		//Map<Object,Object> c.getAllGuestReservations2(12);
//		
//	}
//	
//	public Map<Object, Object> getAllBookingsByUser(long userId) {
//		Map<Object, Object> responseBody = new HashMap<>();
//		System.out.println("===received user id  is === " + userId);
//		try {
//
//			List<Property> properties = (List<Property>) propertyService.findAllGuestReservation2(userId).get(0);
//			List<Booking> bookings = (List<Booking>) propertyService.findAllGuestReservation2(userId).get(1);
//
//			List<Map<Object, Object>> propertyDetails = new ArrayList<Map<Object, Object>>();
//			Map<Object, Object> innerMapToAddBooking = new HashMap<Object, Object>();
//			innerMapToAddBooking.put("pastReservationDetails", "");
//			innerMapToAddBooking.put("presentReservationDetails", "");
//			innerMapToAddBooking.put("futureResevationDetails", "");
//
//			Map<String, ArrayList<Map<Object, Object>>> tryMap = new HashMap<String, ArrayList<Map<Object, Object>>>();
//
//			for (Booking booking : bookings) {
//				long propertyId = booking.getPropertyId();
//				List<Map<Object, Object>> innerBookingDetails = new ArrayList<Map<Object, Object>>();
//
//				List<Map<Object, Object>> innerPresentBookingDetails = new ArrayList<Map<Object, Object>>();
//				ArrayList<Map<Object, Object>> innerFutureBookingDetails = new ArrayList<Map<Object, Object>>();
//				List<Map<Object, Object>> innerPastBookingDetails = new ArrayList<Map<Object, Object>>();
//
//				for (Property property : properties) {
//					if (property.getId() == propertyId) {
//						System.out.println("==== mathced property=== with propertyId" + propertyId);
//						System.out.println("==== mathced property.getId() === with propertyId" + property.getId());
//						System.out.println("!!!!!!!!!!!!!1 mathched property details "
//								+ propertyController.formProperty(property).toString());
//						System.out.println(
//								"!!!!!!!!!!!!!! matched booking details " + bookingController.formBooking(booking));
//
//						// now that the property is present let's check if it is present reservation ,
//						// future or past
//
//						// For future Reservations
//						// get the booking start date and check if it is greater than current system
//						// date
//						if (booking.getStartDate().after(new Date()) && booking.getEndDate().after(new Date())
//								&& !(booking.getStatus().equals("cancelled"))) {
//							System.out.println(
//									"=== reservation is in future ===" + bookingController.formBooking(booking));
//							System.out.println("=== the property is ===" + propertyController.formProperty(property));
//							innerFutureBookingDetails.add(propertyController.formProperty(property));
//							// get from the map and then append
//							ArrayList<Map<Object, Object>> innerFutureBookingDetailsTemp = new ArrayList<Map<Object, Object>>();
//							Map<Object, Object> addBookingToProp = new HashMap<>();
//							if (tryMap.containsKey("futureReservationDetails")) {
//								
//								System.out.println(
//										"===== ````````````try propertyController.formProperty(property)`````````````` ===="
//												+ propertyController.formProperty(property).toString());
//								innerFutureBookingDetailsTemp = tryMap.get("futureReservationDetails");
//								addBookingToProp = propertyController.formProperty(property);
//								addBookingToProp.put("bookingDetails", bookingController.formBooking(booking));
//								innerFutureBookingDetailsTemp.add(addBookingToProp);
////								innerFutureBookingDetailsTemp.add(bookingController.formBooking(booking));
//								tryMap.put("futureReservationDetails", innerFutureBookingDetailsTemp);
//								System.out.println("===========");
//
//							} else {
//
//								System.out.println("=======");
//								addBookingToProp = propertyController.formProperty(property);
//								addBookingToProp.put("bookingDetails", bookingController.formBooking(booking));
//								innerFutureBookingDetailsTemp.add(addBookingToProp);
//								tryMap.put("futureReservationDetails", innerFutureBookingDetailsTemp);
//
//								System.out.println("=======");
//
//							}
//						}
//
//						if ((booking.getStartDate().before(new Date()) && booking.getEndDate().before(new Date()))
//								|| (booking.getStatus().equals("checkedout"))
//								|| (booking.getStatus().equals("cancelled"))) {
////						if((booking.getStartDate().before(new Date()) && booking.getEndDate().before(new Date()))) {
//							System.out
//									.println("=== reservation is in past ===" + bookingController.formBooking(booking));
//							System.out.println("=== the property is ===" + propertyController.formProperty(property));
//							System.out.println("===== booking status ======" + booking.getStatus());
//							innerPastBookingDetails.add(propertyController.formProperty(property));
//
//							ArrayList<Map<Object, Object>> innerPastBookingDetailsTemp = new ArrayList<Map<Object, Object>>();
//							Map<Object, Object> addBookingToProp = new HashMap<>();
//							if (tryMap.containsKey("pastReservationDetails")) {
//							
//								System.out.println("=====");
//								innerPastBookingDetailsTemp = tryMap.get("pastReservationDetails");
//								addBookingToProp = propertyController.formProperty(property);
//								addBookingToProp.put("bookingDetails", bookingController.formBooking(booking));
//								innerPastBookingDetailsTemp.add(addBookingToProp);
//								tryMap.put("pastReservationDetails", innerPastBookingDetailsTemp);
//								System.out.println("=====");
//
//							} else {
//
//								System.out.println("=======");
//								addBookingToProp = propertyController.formProperty(property);
//								addBookingToProp.put("bookingDetails", bookingController.formBooking(booking));
//								innerPastBookingDetailsTemp.add(addBookingToProp);
//								tryMap.put("pastReservationDetails", innerPastBookingDetailsTemp);
//
//								System.out.println("=======");
//
//							}
//
//						}
//
//						if ((booking.getStartDate().equals(new Date()) || (booking.getStartDate().before(new Date())
//								&& (booking.getEndDate().equals(new Date()) || booking.getEndDate().after(new Date()))))
//								&& (!(booking.getStatus().equals("checkedout"))
//										&& (!booking.getStatus().equals("cancelled")))) {
//							System.out.println(
//									"=== reservation is in present ===" + bookingController.formBooking(booking));
//							System.out.println("=== the property is ===" + propertyController.formProperty(property));
//							System.out.println("===== booking status ======" + booking.getStatus());
//							innerPresentBookingDetails.add(propertyController.formProperty(property));
//
//							ArrayList<Map<Object, Object>> innerPresentBookingDetailsTemp = new ArrayList<Map<Object, Object>>();
//							Map<Object, Object> addBookingToProp = new HashMap<>();
//							if (tryMap.containsKey("presentReservationsDetails")) {
//
//								System.out.println("===if===");
//								innerPresentBookingDetailsTemp = tryMap.get("presentReservationsDetails");
//								addBookingToProp = propertyController.formProperty(property);
//								addBookingToProp.put("bookingDetails", bookingController.formBooking(booking));
//								innerPresentBookingDetailsTemp.add(addBookingToProp);
//								tryMap.put("presentReservationsDetails", innerPresentBookingDetailsTemp);
//								System.out.println("======");
//
//							} else {
//
//								System.out.println("====else===");
//								addBookingToProp = propertyController.formProperty(property);
//								addBookingToProp.put("bookingDetails", bookingController.formBooking(booking));
//								innerPresentBookingDetailsTemp.add(addBookingToProp);
//								tryMap.put("presentReservationsDetails", innerPresentBookingDetailsTemp);
//
//								System.out.println("=======");
//
//								System.out.println("`````**************************************");
//							}
////							innerMapToAddBooking.put("presentReservationsDetails", innerFutureBookingDetails);
//						}
//
//					} else {
//						System.out.println("======================");
//						System.out.println("`````````` property Id in booking table " + propertyId);
//						System.out.println("`````````property id in property table " + property.getId());
//					}
//				}
//				System.out.println("===== innerBookingDetails ===" + innerBookingDetails.toString());
//
//				System.out.println("=== ```````````````current system time in millis" + new Date());
//				propertyDetails.add(innerMapToAddBooking);
//			}
//
//			responseBody.put("propertyDetails", tryMap);
//
//		} catch (Exception e) {
//			System.out.println("=== exeception thrown " + e.getMessage());
//			responseBody.put("error", e.getMessage());
//		}
//		return responseBody;
//	}
//	
}
