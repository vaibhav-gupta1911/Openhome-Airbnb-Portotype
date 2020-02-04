package com.openhome.entity;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedStoredProcedureQueries;
import javax.persistence.NamedStoredProcedureQuery;
import javax.persistence.ParameterMode;
import javax.persistence.StoredProcedureParameter;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name = "Hotel")
@Data
@NamedStoredProcedureQueries({
        @NamedStoredProcedureQuery(name = "getAllhotels",
                                    procedureName = "hotels",
         
                                    		 parameters = { 
                                     				@StoredProcedureParameter(mode =ParameterMode.IN, type = Integer.class, name = "x")
                                     	
                                     			}
        ,resultClasses = Hotel.class)
})
public class Hotel{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
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

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	private String city;

	private String state;
	
	private String fullName;
	
	
}
