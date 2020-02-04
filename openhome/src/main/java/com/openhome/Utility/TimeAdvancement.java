package com.openhome.Utility;

import java.util.Date;

public class TimeAdvancement {

	// static variable single_instance of type Singleton
	private static TimeAdvancement single_instance = null;

	public Date getLatestDate() { 
		return DateTimeUtility.getUpdatedTime(miliseconds);
	}

	public long miliseconds;

	// private constructor restricted to this class itself
	private TimeAdvancement() {
		miliseconds = 0;
	}

	// static method to create instance of Singleton class
	public static TimeAdvancement getInstance() {
		// To ensure only one instance is created
		if (single_instance == null) {
			single_instance = new TimeAdvancement();
		}
		return single_instance;
	}
}
