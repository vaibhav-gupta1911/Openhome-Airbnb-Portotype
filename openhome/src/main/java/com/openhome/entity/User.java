package com.openhome.entity;

import javax.persistence.*;

@Entity
public class User {
	
	
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private long id;

    private String firstName;
    
    private String lastName;

	private String email;

    private String password;

    private boolean isVerified;
    
    private String type;

    private boolean facebookSignIn;
    
    private boolean googleSignIn;
    
    
	public boolean isFacebookSignIn() {
		return facebookSignIn;
	}

	public void setFacebookSignIn(boolean facebookSignIn) {
		this.facebookSignIn = facebookSignIn;
	}

	public boolean isGoogleSignIn() {
		return googleSignIn;
	}

	public void setGoogleSignIn(boolean googleSignIn) {
		this.googleSignIn = googleSignIn;
	}

	public void setVerified(boolean isVerified) {
		this.isVerified = isVerified;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public boolean getIsVerified() {
		return isVerified;
	}

	public void setIsVerified(boolean isVerified) {
		this.isVerified = isVerified;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}    
   
}