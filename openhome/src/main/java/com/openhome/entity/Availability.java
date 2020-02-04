package com.openhome.entity;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Availability {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;
	private long propertyId;
	private int day;
//	private boolean alwaysAvailable;
//	private boolean monday;
//	private boolean tuesday;
//	private boolean wednesday;
//	private boolean thursday;
//	private boolean friday;
//	private boolean saturday;
//	private boolean sunday;
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public long getPropertyId() {
		return propertyId;
	}
	public void setPropertyId(long propertyId) {
		this.propertyId = propertyId;
	}
	public int getDay() {
		return day;
	}
	public void setDay(int day) {
		this.day = day;
	}
		
	
}
