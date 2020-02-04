package com.openhome.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.persistence.EntityManager;
import javax.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.openhome.Utility.Constants;
import com.openhome.Utility.DateTimeUtility;
import com.openhome.Utility.TimeAdvancement;
import com.openhome.entity.CustomSystemTime;
import com.openhome.repository.CustomSystemTimeRepository;

@Service
public class CustomSystemTimeService {

	@Autowired
	CustomSystemTimeRepository timerepo;

	@Autowired
	EntityManager em;

	public Date setTime(long milisec, Date dt) {

		DateTimeUtility.setTimeAdvancement(milisec);
		
		return TimeAdvancement.getInstance().getLatestDate();
	}

	public String getTime() throws ParseException {

		return TimeAdvancement.getInstance().getLatestDate().toString();
	}

//	public Date setTime2(long milisec, Date dt) {
//		
//    	CustomSystemTime t = new CustomSystemTime();
//		t.setId((long) 1);
//		t.setMiliseconds(milisec);
//		t.setSystemDate(dt);
//
//		timerepo.save(t);
//
//		CustomSystemTime t2 = timerepo.getOne((long) 1);
//		return t2.getSystemDate();
//	}
//
//	public String getTime() throws ParseException {
//
//		try {
//			CustomSystemTime t = timerepo.getOne((long) 1);
//
//			return DateTimeUtility.getUpdatedTimeString(t.getMiliseconds());
//
//		} catch (EntityNotFoundException e) {
//			return DateTimeUtility.getSimpleFormattedCurrentDate();
//		}
//	}

}
