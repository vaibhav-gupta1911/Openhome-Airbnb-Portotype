package com.openhome.Utility;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.concurrent.TimeUnit;

public class DateTimeUtility {

	public static Date jsMomentToJavaDate(String colname, HashMap<Object, Object> map) throws ParseException {
		long jsDate = (long) map.get(colname);

		Date newDate = new Date(jsDate);
		System.out.println("Incoming Date - " + newDate);
		return newDate;
	}

	public static Date jsMomentToJavaDate2(String colname, HashMap<Object, Object> map) throws ParseException {

		String dt = (String) map.get(colname);
		String dtnew = dt.replace('T', ' ');

		String start_date = ((String) map.get(colname)).concat("T15:00:00.0000000Z");
		Date startDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'.'S'Z'").parse(start_date);

		System.out.println("Incoming Date - " + dt);
		return new SimpleDateFormat(Constants.DATEFORMAT).parse(dtnew);
	}

	public static Date getUpdatedTime(long milsec) {
		Date currentdate = new Date();
		return new Date(currentdate.getTime() + milsec);
	}

	public static String getUpdatedTimeString(long milsec) {
		Date currentdate = new Date();
		Date d = new Date(currentdate.getTime() + milsec);
		return d.toString();
	}

	public static String getSimpleFormattedCurrentDate() {
		Date today = new Date();
		SimpleDateFormat DATE_FORMAT = new SimpleDateFormat(Constants.DATEFORMAT);
		String date = DATE_FORMAT.format(today);
		return date;
	}

	// HOURS

	public static int getHoursDiff(Date startDateTime, Date endDateTime) {
		long secs = (endDateTime.getTime() - startDateTime.getTime()) / 1000;
		int hours = (int) (secs / 3600);
		return hours;
	}

	// MINUTES

	public static int getMinsDiff(Date startDateTime, Date endDateTime) {
		long secs = (endDateTime.getTime() - startDateTime.getTime()) / 1000;
		secs = secs % 3600;
		int mins = (int) (secs / 60);
		return mins;
	}
	
	//DAYS 
	
	public static int getDifferenceDays(Date startDateTime, Date endDateTime) {
		    long diff = endDateTime.getTime() - startDateTime.getTime();
		    // System.out.println("days in long.. " +  (TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS)));
		    // System.out.println("days in int .. "+ (int) (TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS)));
		    return (int) (TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS));
		}
	
	public static boolean isWeekend(Date date) {
		Calendar c1 = Calendar.getInstance();
		c1.setTime(date);

		if (c1.get(Calendar.DAY_OF_WEEK) == Calendar.SATURDAY || c1.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY) {
			return true;
		}

		return false;
	}

	public static void setTimeAdvancement(long milsec) {
		TimeAdvancement ta = TimeAdvancement.getInstance();
		ta.miliseconds = milsec;
	}

	public static Date getCurrentTime() {
		return TimeAdvancement.getInstance().getLatestDate();
	}

}
