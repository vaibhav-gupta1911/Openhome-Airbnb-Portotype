package com.openhome.entity;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Booking {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	private long propertyId;
	private long guestId;
	private Date startDate;
	private Date endDate;
	private double price;
	private String status;
	private double penalty;
	private double noShowPenalty;
	private Date checkedInDate;
	private Date checkedOutDate;
	private double weekdayPrice;
	private double weekendPrice;
	
	private double ownerPenalty;
	private double refund;
	private int rating;
	private String review;
	private int hostrating;
	private String hostreview;
	private double parkingFee;
	
	
	public double getParkingFee() {
		return parkingFee;
	}

	public void setParkingFee(double parkingFee) {
		this.parkingFee = parkingFee;
	}

	public int getHostrating() {
		return hostrating;
	}

	public void setHostrating(int hostrating) {
		this.hostrating = hostrating;
	}

	public String getHostreview() {
		return hostreview;
	}

	public void setHostreview(String hostreview) {
		this.hostreview = hostreview;
	}

	
	
	public String getReview() {
		return review;
	}

	public void setReview(String review) {
		this.review = review;
	}

	public double getOwnerPenalty() {
		return ownerPenalty;
	}

	public void setOwnerPenalty(double ownerPenalty) {
		this.ownerPenalty = ownerPenalty;
	}

	public double getRefund() {
		return refund;
	}

	public void setRefund(double refund) {
		this.refund = refund;
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

	public Date getCheckedInDate() {
		return checkedInDate;
	}

	public void setCheckedInDate(Date checkedInDate) {
		this.checkedInDate = checkedInDate;
	}

	public Date getCheckedOutDate() {
		return checkedOutDate;
	}

	public void setCheckedOutDate(Date checkedOutDate) {
		this.checkedOutDate = checkedOutDate;
	}

	

	public double getPenalty() {
		return penalty;
	}

	public void setPenalty(double penalty) {
		this.penalty = penalty;
	}

	public double getNoShowPenalty() {
		return noShowPenalty;
	}

	public void setNoShowPenalty(double noShowPenalty) {
		this.noShowPenalty = noShowPenalty;
	}


	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getPropertyId() {
		return propertyId;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public void setPropertyId(long propertyId) {
		this.propertyId = propertyId;
	}

	public long getGuestId() {
		return guestId;
	}

	public void setGuestId(long guestId) {
		this.guestId = guestId;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public int getRating() {
		return rating;
	}

	public void setRating(int rating) {
		this.rating = rating;
	}

	@Override
	public String toString() {
		return "Booking [id=" + id + ", propertyId=" + propertyId + ", guestId=" + guestId + ", startDate=" + startDate
				+ ", endDate=" + endDate + ", price=" + price + ", status=" + status + "]";
	}

}
