package com.openhome.entity;

import java.sql.Date;

import javax.persistence.*;

import lombok.Data;

//OR
@Entity
@Data
@NamedStoredProcedureQueries({
		@NamedStoredProcedureQuery(name = "getAvailability", procedureName = "availability", parameters = {
				@StoredProcedureParameter(mode = ParameterMode.IN, type = Date.class, name = "pstartDate"),
				@StoredProcedureParameter(mode = ParameterMode.IN, type = Date.class, name = "pendDate"),
				@StoredProcedureParameter(mode = ParameterMode.IN, type = String.class, name = "pcity")
//          				@StoredProcedureParameter(mode =ParameterMode.IN, type = Integer.class, name = "pzipcode"),
//          				@StoredProcedureParameter(mode =ParameterMode.IN, type = String.class, name = "psharingType"),
//          				@StoredProcedureParameter(mode =ParameterMode.IN, type = String.class, name = "ppropertyType"),
//          				@StoredProcedureParameter(mode =ParameterMode.IN, type = Double.class, name = "pminPrice"),
//          				@StoredProcedureParameter(mode =ParameterMode.IN, type = Double.class, name = "pmaxPrice"),
//          				@StoredProcedureParameter(mode =ParameterMode.IN, type = String.class, name = "pkeywords"),
//          				@StoredProcedureParameter(mode =ParameterMode.IN, type = Boolean.class, name = "pinternet")
		}, resultClasses = Property.class),
		@NamedStoredProcedureQuery(name = "updateAvailability", procedureName = "changeAvailability", parameters = {
				@StoredProcedureParameter(mode = ParameterMode.IN, type = Date.class, name = "pstartDate"),
				@StoredProcedureParameter(mode = ParameterMode.IN, type = Date.class, name = "pendDate"),
				@StoredProcedureParameter(mode = ParameterMode.IN, type = Long.class, name = "bookingid"),
				@StoredProcedureParameter(mode = ParameterMode.IN, type = Double.class, name = "price"),
				@StoredProcedureParameter(mode = ParameterMode.IN, type = Long.class, name = "pid"),
				@StoredProcedureParameter(mode = ParameterMode.OUT, type = Double.class, name = "penalty")
		}),
		@NamedStoredProcedureQuery(name = "checkConflict", procedureName = "checkConflict", parameters = {
				@StoredProcedureParameter(mode = ParameterMode.IN, type = Date.class, name = "pstartDate"),
				@StoredProcedureParameter(mode = ParameterMode.IN, type = Date.class, name = "pendDate"),
				@StoredProcedureParameter(mode = ParameterMode.IN, type = Long.class, name = "monday"),
				@StoredProcedureParameter(mode = ParameterMode.IN, type = Long.class, name = "tuesday"),
				@StoredProcedureParameter(mode = ParameterMode.IN, type = Long.class, name = "wednesday"),
				@StoredProcedureParameter(mode = ParameterMode.IN, type = Long.class, name = "thursday"),
				@StoredProcedureParameter(mode = ParameterMode.IN, type = Long.class, name = "friday"),
				@StoredProcedureParameter(mode = ParameterMode.IN, type = Long.class, name = "saturday"),
				@StoredProcedureParameter(mode = ParameterMode.IN, type = Long.class, name = "sunday"),
				@StoredProcedureParameter(mode = ParameterMode.OUT, type = Long.class, name = "conflict")
		})})
public class Property {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	private long userId;

	private String streetAddress;

	private String city;

	private String state;

	private int zipcode;

	private String sharingType;

	private String propertyType;

	private int totalBedrooms;

	private int totalSquareFootage;

	private int roomSquareFootage;

	private boolean privateBathroom;

	private boolean privateShower;

	private double weekdayPrice;

	private double weekendPrice;

	private long phoneNumber;

	private String description;

	private String pictureUrl;

	private boolean parking;

	private double dailyParkingFee;

	private boolean internet;

	private int monday;
	private int tuesday;
	private int wednesday;
	private int thursday;
	private int friday;
	private int saturday;
	private int sunday;

	private boolean isDeleted;

	public int getMonday() {
		return monday;
	}

	public void setMonday(int monday) {
		this.monday = monday;
	}

	public int getTuesday() {
		return tuesday;
	}

	public void setTuesday(int tuesday) {
		this.tuesday = tuesday;
	}

	public int getWednesday() {
		return wednesday;
	}

	public void setWednesday(int wednesday) {
		this.wednesday = wednesday;
	}

	public int getThursday() {
		return thursday;
	}

	public void setThursday(int thursday) {
		this.thursday = thursday;
	}

	public int getFriday() {
		return friday;
	}

	public void setFriday(int friday) {
		this.friday = friday;
	}

	public int getSaturday() {
		return saturday;
	}

	public void setSaturday(int saturday) {
		this.saturday = saturday;
	}

	public int getSunday() {
		return sunday;
	}

	public void setSunday(int sunday) {
		this.sunday = sunday;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getUserId() {
		return userId;
	}

	public void setUserId(long userId) {
		this.userId = userId;
	}

	public String getStreetAddress() {
		return streetAddress;
	}

	public void setStreetAddress(String streetAddress) {
		this.streetAddress = streetAddress;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public int getZipcode() {
		return zipcode;
	}

	public void setZipcode(int zipcode) {
		this.zipcode = zipcode;
	}

	public String getSharingType() {
		return sharingType;
	}

	public void setSharingType(String sharingType) {
		this.sharingType = sharingType;
	}

	public String getPropertyType() {
		return propertyType;
	}

	public void setPropertyType(String propertyType) {
		this.propertyType = propertyType;
	}

	public int getTotalBedrooms() {
		return totalBedrooms;
	}

	public void setTotalBedrooms(int totalBedrooms) {
		this.totalBedrooms = totalBedrooms;
	}

	public int getTotalSquareFootage() {
		return totalSquareFootage;
	}

	public void setTotalSquareFootage(int totalSquareFootage) {
		this.totalSquareFootage = totalSquareFootage;
	}

	public int getRoomSquareFootage() {
		return roomSquareFootage;
	}

	public void setRoomSquareFootage(int roomSquareFootage) {
		this.roomSquareFootage = roomSquareFootage;
	}

	public boolean isPrivateBathroom() {
		return privateBathroom;
	}

	public void setPrivateBathroom(boolean privateBathroom) {
		this.privateBathroom = privateBathroom;
	}

	public boolean isPrivateShower() {
		return privateShower;
	}

	public void setPrivateShower(boolean privateShower) {
		this.privateShower = privateShower;
	}

	public double getWeekdayPrice() {
		return weekdayPrice;
	}

	public void setWeekdayPrice(double weekdayPrice) {
		this.weekdayPrice = weekdayPrice;
	}

	public double getWeekendPrice() {
		return weekendPrice;
	}

	public void setWeekendPrice(double weekendPrice) {
		this.weekendPrice = weekendPrice;
	}

	public long getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(long phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getPictureUrl() {
		return pictureUrl;
	}

	public void setPictureUrl(String pictureUrl) {
		this.pictureUrl = pictureUrl;
	}

	public boolean isParking() {
		return parking;
	}

	public void setParking(boolean parking) {
		this.parking = parking;
	}

	public double getDailyParkingFee() {
		return dailyParkingFee;
	}

	public void setDailyParkingFee(double dailyParkingFee) {
		this.dailyParkingFee = dailyParkingFee;
	}

	public boolean isInternet() {
		return internet;
	}

	public void setInternet(boolean internet) {
		this.internet = internet;
	}

	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean isDeleted) {
		this.isDeleted = isDeleted;
	}

	@Override
	public String toString() {
		return "Property [id=" + id + ", userId=" + userId + ", city=" + city + "]";
	}

}