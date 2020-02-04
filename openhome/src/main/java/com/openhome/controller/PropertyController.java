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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import com.openhome.entity.Availability;
import com.openhome.entity.BlockedAvailability;
import com.openhome.entity.Property;
import com.openhome.entity.User;
import com.openhome.service.AvailabilityRepositoryService;
import com.openhome.service.BlockedAvailabilityRepositoryService;
import com.openhome.service.PropertyRepositoryService;
import com.openhome.service.UserRepositoryService;

@RestController
public class PropertyController {

	@Autowired
	private PropertyRepositoryService propertyService;

	@Autowired
	private UserRepositoryService userService;

	@Autowired
	private AvailabilityRepositoryService availabilityService;

	@Autowired
	private BlockedAvailabilityRepositoryService blockedAvailabilityService;

	@Autowired
	private UserController userController;

	@PostMapping("/postProperty")
	public @ResponseBody Map<Object, Object> postProperty(HttpServletResponse response,
			@RequestBody HashMap<Object, Object> map) {

		Property property = new Property();
		long userId = Long.valueOf((Integer) map.get("userId"));
		String streetAddress = (String) map.get("streetAddress");
		String city = (String) map.get("city");
		String state = (String) map.get("state");
		int zipcode = (int) map.get("zipcode");
		String sharingType = (String) map.get("sharingType");
		String propertyType = (String) map.get("propertyType");
		int totalBedrooms = (int) map.get("totalBedrooms");
		int totalSquareFootage = (int) map.get("totalSquareFootage");
		int roomSquareFootage = (int) map.get("roomSquareFootage");
		boolean privateBathroom = (boolean) map.get("privateBathroom");
		boolean privateShower = (boolean) map.get("privateShower");
		double weekdayPrice = Double.valueOf((String) map.get("weekdayPrice"));
		double weekendPrice = Double.valueOf((String) map.get("weekendPrice"));
		long phoneNumber = (long) map.get("phoneNumber");
		String description = (String) map.get("description");
		String pictureUrls = (String) map.get("pictureUrl");
		boolean parking = (boolean) map.get("parking");
		double dailyParkingFee = Double.valueOf((String) map.get("dailyParkingFee"));
		boolean internet = (boolean) map.get("internet");

		int monday = (int) map.get("monday");
		int tuesday = (int) map.get("tuesday");
		int wednesday = (int) map.get("wednesday");
		int thursday = (int) map.get("thursday");
		int friday = (int) map.get("friday");
		int saturday = (int) map.get("saturday");
		int sunday = (int) map.get("sunday");

		property.setUserId(userId);
		property.setStreetAddress(streetAddress);
		property.setCity(city);
		property.setState(state);
		property.setZipcode(zipcode);
		property.setSharingType(sharingType);
		property.setPropertyType(propertyType);
		property.setTotalBedrooms(totalBedrooms);
		property.setTotalSquareFootage(totalSquareFootage);
		property.setRoomSquareFootage(roomSquareFootage);
		property.setPrivateBathroom(privateBathroom);
		property.setPrivateShower(privateShower);
		property.setWeekdayPrice(weekdayPrice);
		property.setWeekendPrice(weekendPrice);
		property.setPhoneNumber(phoneNumber);
		property.setDescription(description);
		property.setPictureUrl(pictureUrls);
		property.setParking(parking);
		property.setDailyParkingFee(dailyParkingFee);
		property.setInternet(internet);

		property.setMonday(monday);
		property.setTuesday(tuesday);
		property.setWednesday(wednesday);
		property.setThursday(thursday);
		property.setFriday(friday);
		property.setSaturday(saturday);
		property.setSunday(sunday);

		property = propertyService.createProperty(property);

		Map<Object, Object> responseBody = new HashMap<>();
		responseBody.put("propertyDetails", formProperty(property));
		try {
			System.out.println("Property :::" + property);
			responseBody.put("propertyDetails", formProperty(property));
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			responseBody.put("error", e.getMessage());
		}

		User user = userService.getUserById(userId);
		String subject = "Property Posted";
		String content = "You just posted a Property!";
		userController.sendNotification(user, subject, content);
		return responseBody;
	}

	@GetMapping("/getProperty/{propertyId}")
	public @ResponseBody Map<Object, Object> getProperty(HttpServletRequest request, HttpServletResponse response,
			@PathVariable(name = "propertyId") long propertyId) {
		Map<Object, Object> responseBody = new HashMap<>();
		try {
			Property property = new Property();
			property = propertyService.findPropertyById(propertyId);
			System.out.println("Property :::" + property);
			responseBody.put("propertyDetails", formProperty(property));
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			responseBody.put("error", e.getMessage());
		}
		return responseBody;
	}

	@GetMapping("/getAllProperties/{hostId}")
	public @ResponseBody Map<Object, Object> getAllProperties(HttpServletRequest request, HttpServletResponse response,
			@PathVariable(name = "hostId") long hostId) {
		Map<Object, Object> responseBody = new HashMap<>();
		try {
			List<Property> properties = propertyService.findAllProperties(hostId);
			List<Map<Object, Object>> propertyDetails = new ArrayList<Map<Object, Object>>();
			for (Property property : properties) {
				propertyDetails.add(formProperty(property));
			}
			responseBody.put("propertyDetails", propertyDetails);
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			responseBody.put("error", e.getMessage());
		}
		return responseBody;
	}

	@PutMapping("/updatePropertyPrice/{propertyId}")
	public @ResponseBody Map<Object, Object> updatePropertyPrice(HttpServletResponse response,
			@RequestBody HashMap<Object, Object> map, @PathVariable(name = "propertyId") long propertyId) {
		double weekdayPrice = Double.valueOf((String) map.get("weekdayPrice"));
		double weekendPrice = Double.valueOf((String) map.get("weekendPrice"));
		Property property = propertyService.findPropertyById(propertyId);
		property.setWeekdayPrice(weekdayPrice);
		property.setWeekendPrice(weekendPrice);
		property = propertyService.updateProperty(property);
		Map<Object, Object> responseBody = new HashMap<>();
		responseBody.put("propertyDetails", formProperty(property));
		try {
			System.out.println("Property :::" + property);
			responseBody.put("propertyDetails", formProperty(property));
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			responseBody.put("error", e.getMessage());
		}
		User user = userService.getUserById(property.getUserId());
		String subject = "Property Price Updated!";
		String content = "You just updated a Property Price!";
		userController.sendNotification(user, subject, content);
		return responseBody;
	}

	@PutMapping("/updatePropertyAvailability/{propertyId}")
	public @ResponseBody Map<Object, Object> updatePropertyAvailability(HttpServletResponse response,
			@RequestBody HashMap<Object, Object> map, @PathVariable(name = "propertyId") long propertyId) {
		int monday = (int) map.get("monday");
		int tuesday = (int) map.get("tuesday");
		int wednesday = (int) map.get("wednesday");
		int thursday = (int) map.get("thursday");
		int friday = (int) map.get("friday");
		int saturday = (int) map.get("saturday");
		int sunday = (int) map.get("sunday");

		Property property = propertyService.findPropertyById(propertyId);

		property.setMonday(monday);
		property.setTuesday(tuesday);
		property.setWednesday(wednesday);
		property.setThursday(thursday);
		property.setFriday(friday);
		property.setSaturday(saturday);
		property.setSunday(sunday);

		property = propertyService.updateProperty(property);
		Map<Object, Object> responseBody = new HashMap<>();
		responseBody.put("propertyDetails", formProperty(property));
		try {
			System.out.println("Property :::" + property);
			responseBody.put("propertyDetails", formProperty(property));
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			responseBody.put("error", e.getMessage());
		}

		System.out.println(propertyService.updateAllBooking(propertyId));

		User user = userService.getUserById(property.getUserId());
		String subject = "Property Availability Updated!";
		String content = "You just updated a Property Availability!";
		userController.sendNotification(user, subject, content);

		return responseBody;
	}

	@PutMapping("/checkConflict/{propertyId}")
	public @ResponseBody Map<Object, Object> checkConflict(HttpServletResponse response,
			@RequestBody HashMap<Object, Object> map, @PathVariable(name = "propertyId") long propertyId) {

		Map<Object, Object> responseBody = new HashMap<>();

		try {
			responseBody.put("conflict", propertyService.checkConflict(map, propertyId));

		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			responseBody.put("error", e.getMessage());
		}

		return responseBody;
	}

	@GetMapping("/checkConflictOnDelete/{propertyId}")
	public @ResponseBody Map<Object, Object> checkConflictOnDelete(HttpServletResponse response,
			@PathVariable(name = "propertyId") long propertyId) {

		Map<Object, Object> responseBody = new HashMap<>();
		System.out.println("Before Going to Service");
		try {
			responseBody.put("conflict", propertyService.checkConflictOnDelete(propertyId));

		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			responseBody.put("error", e.getMessage());
		}

		return responseBody;
	}

	@PostMapping("/blockDates")
	public @ResponseBody BlockedAvailability blockDates(@RequestBody HashMap<Object, Object> map)
			throws ParseException {

		long propertyId = Long.valueOf((Integer) map.get("propertyId"));
		Date startDate = new SimpleDateFormat("yyyy-MM-dd").parse((String) map.get("startDate"));
		Date endDate = new SimpleDateFormat("yyyy-MM-dd").parse((String) map.get("endDate"));

		BlockedAvailability blockedAvailability = new BlockedAvailability();
		blockedAvailability.setPropertyId(propertyId);
		blockedAvailability.setStartDate(startDate);
		blockedAvailability.setEndDate(endDate);
		blockedAvailability = blockedAvailabilityService.addBlockedDate(blockedAvailability);
		return blockedAvailability;
	}

	@GetMapping("/getProperties/search")
	public @ResponseBody Map<Object, Object> getProperties(HttpServletRequest request, HttpServletResponse response,
			@RequestParam(name = "city") String city,
//			@RequestParam(name = "zipcode", required = false) Integer zipcode,
			@RequestParam(name = "startDate") String startDate, @RequestParam(name = "endDate") String endDate) {
		Map<Object, Object> map = new HashMap<>();
		map.put("city", city);
//		if (zipcode != null)
//			map.put("zipcode", zipcode);	
		map.put("startDate", startDate);
		map.put("endDate", endDate);

		System.out.println("Property Controller Map" + map);
		Map<Object, Object> responseBody = new HashMap<>();
		try {
			List<Property> properties = propertyService.findProperties(map);
			List<Map<Object, Object>> propertyDetails = new ArrayList<Map<Object, Object>>();
			for (Property property : properties) {
				propertyDetails.add(formProperty(property));
			}
			responseBody.put("propertyDetails", propertyDetails);
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			responseBody.put("error", e.getMessage());
		}
		return responseBody;
	}

	public Map<Object, Object> formProperty(Property property) {
//		System.out.println("=== in form property===="+property.toString());
		Map<Object, Object> map = new HashMap<>();
		map.put("id", property.getId());
		map.put("userId", property.getUserId());
		map.put("streetAddress", property.getStreetAddress());
		map.put("city", property.getCity());
		map.put("state", property.getState());
		map.put("zipcode", property.getZipcode());
		map.put("sharingType", property.getSharingType());
		map.put("propertyType", property.getPropertyType());
		map.put("totalBedroom", property.getTotalBedrooms());
		map.put("totalSquareFootage", property.getTotalSquareFootage());
		map.put("roomSquareFootage", property.getRoomSquareFootage());
		map.put("privateBathroom", property.isPrivateBathroom());
		map.put("privateShower", property.isPrivateShower());
		map.put("weekdayPrice", property.getWeekdayPrice());
		map.put("weekendPrice", property.getWeekendPrice());
		map.put("phoneNumber", property.getPhoneNumber());
		map.put("description", property.getDescription());
		if (property.getPictureUrl() != null) {
			map.put("pictureUrl", property.getPictureUrl().split(","));
		} else {
//			System.out.println("=== picture not found =====");
		}
		map.put("parking", property.isParking());
		map.put("dailyParkingFee", property.getDailyParkingFee());
		map.put("internet", property.isInternet());
		map.put("monday", property.getMonday());
		map.put("tuesday", property.getTuesday());
		map.put("wednesday", property.getWednesday());
		map.put("thursday", property.getThursday());
		map.put("friday", property.getFriday());
		map.put("saturday", property.getSaturday());
		map.put("sunday", property.getSunday());
		return map;
	}

	@GetMapping("/testSP")
	public @ResponseBody Map<Object, Object> test(HttpServletRequest request, HttpServletResponse response) {
		Map<Object, Object> responseBody = new HashMap<>();
		try {
			List<Property> properties = propertyService.findList();
			List<Map<Object, Object>> propertyDetails = new ArrayList<Map<Object, Object>>();
			for (Property property : properties) {
				propertyDetails.add(formProperty(property));
			}
			responseBody.put("propertyDetails", propertyDetails);
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			responseBody.put("error", e.getMessage());
		}
		return responseBody;

	}

	public Map<Object, Object> formBookedProperty(Property property) {
//		System.out.println("=== in form property===="+property.toString());
		Map<Object, Object> map = new HashMap<>();
		map.put("id", property.getId());
		map.put("userId", property.getUserId());
		map.put("streetAddress", property.getStreetAddress());
		map.put("city", property.getCity());
		map.put("state", property.getState());
		map.put("zipcode", property.getZipcode());
		map.put("sharingType", property.getSharingType());
		map.put("propertyType", property.getPropertyType());
		map.put("totalBedroom", property.getTotalBedrooms());
		map.put("totalSquareFootage", property.getTotalSquareFootage());
		map.put("roomSquareFootage", property.getRoomSquareFootage());
		map.put("privateBathroom", property.isPrivateBathroom());
		map.put("privateShower", property.isPrivateShower());
		map.put("weekdayPrice", property.getWeekdayPrice());
		map.put("weekendPrice", property.getWeekendPrice());
		map.put("phoneNumber", property.getPhoneNumber());
		map.put("description", property.getDescription());
//		map.put("pictureUrl", property.getPictureUrl());
		if (property.getPictureUrl() != null) {
			map.put("pictureUrl", property.getPictureUrl().split(","));
		} else {
			System.out.println("=== picture not  booked found =====");
		}
		map.put("parking", property.isParking());
		map.put("dailyParkingFee", property.getDailyParkingFee());
		map.put("internet", property.isInternet());
		map.put("monday", property.getMonday());
		map.put("tuesday", property.getTuesday());
		map.put("wednesday", property.getWednesday());
		map.put("thursday", property.getThursday());
		map.put("friday", property.getFriday());
		map.put("saturday", property.getSaturday());
		map.put("sunday", property.getSunday());
		map.put("bookingDetails", "");
		return map;
	}

}