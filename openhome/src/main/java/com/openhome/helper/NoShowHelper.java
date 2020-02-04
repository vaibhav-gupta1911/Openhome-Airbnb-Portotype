package com.openhome.helper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.openhome.service.BookingRepositoryService;

@Component
public class NoShowHelper {

	@Autowired
	BookingRepositoryService bookingService;
	
	@Scheduled(cron="0 0 3 * * *", zone="America/Los_Angeles")
	public void scheduledNoShow() {
		System.out.println("Yeah!!! Scheduling is working!!!");
		bookingService.updateNoShow();
		
	}
	
}