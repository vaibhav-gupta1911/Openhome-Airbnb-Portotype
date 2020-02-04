package com.openhome.entity;

import javax.persistence.*;


import java.util.Date;
import java.util.UUID;

@Entity
public class Verification {
	
	
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private long id;

    private String token;
    
    private long userId;

	private Date createdDate;
	
	private Date expiryDate;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public long getUserId() {
		return userId;
	}

	public void setUserId(long userId) {
		this.userId = userId;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Date getExpiryDate() {
		return expiryDate;
	}

	public void setExpiryDate(Date expiryDate) {
		this.expiryDate = expiryDate;
	}

	 
   
}