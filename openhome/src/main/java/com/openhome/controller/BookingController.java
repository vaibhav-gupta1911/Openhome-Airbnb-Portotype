package com.openhome.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.RestController;

import com.openhome.entity.Booking;
import com.openhome.entity.Property;

@RestController
public class BookingController {

	public Map<Object, Object> formBooking(Booking booking) {
//		System.out.println("=== in form booking===="+booking.toString());
		Map<Object, Object> map = new HashMap<>();
		map.put("id",booking.getId());
		map.put("propertyId",booking.getPropertyId());
		map.put("guestId", booking.getGuestId());
		map.put("startDate",booking.getStartDate());
		map.put("endDate",booking.getEndDate());
		map.put("status", booking.getStatus());
		map.put("price",booking.getPrice());
		map.put("penalty",booking.getPenalty());
		map.put("checkedInDate",booking.getCheckedInDate());
		map.put("checkedOutDate",booking.getCheckedOutDate());
		map.put("noShowPenalty",booking.getNoShowPenalty());
		System.out.println("noShow"+booking.getNoShowPenalty());
		map.put("weekdayPrice",booking.getWeekdayPrice());
		map.put("weekendPrice",booking.getWeekendPrice());
		map.put("rating", booking.getRating());
		map.put("review", booking.getReview());
		map.put("hostRating", booking.getHostrating());
		map.put("hostReview", booking.getHostreview());
		map.put("parkingFee", booking.getParkingFee());
		return map;
	}

}
