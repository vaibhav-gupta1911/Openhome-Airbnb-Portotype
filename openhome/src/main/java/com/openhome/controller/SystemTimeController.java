package com.openhome.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Scope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.openhome.Utility.Constants;
import com.openhome.Utility.DateTimeUtility;
import com.openhome.Utility.TimeAdvancement;
import com.openhome.entity.Booking;
import com.openhome.entity.Payment;
import com.openhome.entity.Property;
import com.openhome.entity.User;
import com.openhome.repository.PaymentRepository;
import com.openhome.service.BlockedAvailabilityRepositoryService;
import com.openhome.service.BookingRepositoryService;
import com.openhome.service.CustomSystemTimeService;
import com.openhome.service.PaymentRepositoryService;
import com.openhome.service.PropertyRepositoryService;
import com.openhome.service.UserRepositoryService;


@RestController
public class SystemTimeController {

	@Autowired
	private CustomSystemTimeService systemtimeService;
	
	@Autowired
	BlockedAvailabilityRepositoryService blockedAvailabilityRepositoryService;
	
	@Autowired
	private BookingRepositoryService bookingService;
	
	@Autowired
	private UserController userController;
	
	@Autowired
	private UserRepositoryService userService;
	
	@Autowired
	private PropertyRepositoryService propertyService;
	
	@Autowired
	private PaymentRepositoryService paymentService;

	@GetMapping("/systemdate")
	public @ResponseBody String getAllHostReservations(HttpServletRequest request, HttpServletResponse response) throws ParseException {

		String dt = systemtimeService.getTime();
		return dt;
	}

	@PostMapping("/systemdate")
	public @ResponseBody Date blockDates(@RequestBody HashMap<Object, Object> map,HttpServletResponse response) throws ParseException {
		System.out.println("==== here to update the system 's time for time advancement =======\n");
		Date increasedDate = DateTimeUtility.jsMomentToJavaDate("date", map);
		Date currentdate = new Date();
		
		
		long milsc = increasedDate.getTime() - currentdate.getTime();
		Date updateddate = new Date(currentdate.getTime() + milsc);
		
	    System.out.println("system date set - "+ increasedDate);

	    //updating the backend's system time
	    systemtimeService.setTime(milsc, updateddate);
		
		System.out.println("==== TimeAdvancement.getInstance().getLatestDate();======="+TimeAdvancement.getInstance().getLatestDate());
		
		// after the system's current time is changed
		
		// REQUIREMENT 1 : UPDATE NO SHOW AND CALCULATE THE PENALTY
		
		// for all the entries in booking table whose status is reserved 
	    // using findReservedPropertiesOfAllUsers
	    try {
	    	List<Booking> bookings = bookingService.findReservedPropertiesOfAllUsers();
	    	for (Booking booking : bookings) {
				System.out.println("=== fetched reserved properties of user are " + booking.toString());
				System.out.println("==== property id is ====" + booking.getPropertyId());
				System.out.println("==== booking id id =====" + booking.getId());
				long propertyId = booking.getPropertyId();
				// fetch the booking start date and end date
				Date startDate = booking.getStartDate();
				Date endDate = booking.getEndDate();
				System.out.println(" ==== booking start date is ===="+startDate+"\n==== booking end date is ==="+endDate);
				// get the current time using DateTimeUtility.getCurrentTime()
				Date currentTime = DateTimeUtility.getCurrentTime();
				System.out.println(" ==== currentTime is ====="+currentTime);
				
				// check for the penalty calculations if applicable:  
				// the penalty should be of no show 
				//from the startdate map the constraints
				// constraints are that between 3:00AM to next day 3:00PM if the user has not checkiedin then 
				
				// if hours are less than 12 than no show will come
				// otherwise no penalty or no noshow update
				int hours = (int) Duration.between(startDate.toInstant(),currentTime.toInstant()).toHours();
				System.out.println("=== hours===="+hours);
				if(hours>12) {
					// penalty APPLICABLE and update noshow  as well
					// get the no days the proerty is booked to calcuate the penalty
					int days = (int) Duration.between(startDate.toInstant(), endDate.toInstant()).toDays();
					Calendar startDateCalender = Calendar.getInstance();
					startDateCalender.setTime(booking.getStartDate());

					int startDay = startDateCalender.get(Calendar.DAY_OF_WEEK);
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
					booking.setNoShowPenalty(penalty);
					booking.setStatus("noshow");
					bookingService.updateBooking(booking);
					
					//Payment on No Show on Time Advancement
					Payment p = new Payment();
					p.setEntryDate(DateTimeUtility.getCurrentTime());
					p.setAmount(penalty);
					p.setBookingid(booking.getId());
					p.setPropertyid(booking.getPropertyId());
					p.setOwner(booking.getGuestId());
					p.setReason("NO SHOW PENALTY");
					paymentService.makePaymentonCancelltion(p);
					
					
					//Email Guest
					User guest = userService.getUserById(booking.getGuestId());
					String subject = "No Show Penalty Charged!";
					String content = "You have been charged by no show penalty!";
					userController.sendNotification(guest, subject, content);
					
					//Email Host
					Property property = propertyService.findPropertyById(booking.getPropertyId());
					User host = userService.getUserById(property.getUserId());
					String subject1 = "No Show!";
					String content1 = "Guest didn't show up for your booked property!";
					userController.sendNotification(host, subject1, content1);
					
					
					// remove the entry from block availability table
					Map<Object, Object> map1 = new HashMap<>();
					map1.put("propertyId", booking.getPropertyId());
					map1.put("startDate", booking.getStartDate());
					map1.put("endDate", booking.getEndDate());
					
					String updateBlockResponse = null;
					try {
						updateBlockResponse = blockedAvailabilityRepositoryService.changeBlockedDate(map1);
					} catch (Exception e1) {
						// TODO Auto-generated catch block
						System.out.println("error"+e1);
					}
					System.out.println("Update BLock Response:::" + updateBlockResponse);
					
				}else {
					System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
					System.out.println("=== no penalty and no noshow update applicable");
				}
				
			}
	    	
	    	
	    	// REQUIREMENT 2: AUTOCHECKOUT
		    try{
		    	System.out.println("====== here for AUTOMATIC CHECKOUT");
		    	bookingService.emailForCheckedInProperties();
		    	bookingService.findCheckedInPropertiesOfAllUsers();
		    	
		    	System.out.println("executed automatic checkout");
		    	
		    }catch(Exception e) {
		    	System.out.println("==== exception in automatic checkout"+e);
		    }
	    	
	    	
	    }catch(Exception e) {
	    	System.out.println("=== exception is "+e);
	    	System.out.println("=== exeception thrown " + e);
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
	    }
  
	    
	    
	    
	    // returning the set time to frontend
//	    return (Date) systemtimeService.getTime();
	    return TimeAdvancement.getInstance().getLatestDate();
	}

}