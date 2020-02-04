package com.openhome.controller;

import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.hamcrest.CoreMatchers;
import org.hamcrest.Matchers;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.anyLong;
import org.springframework.beans.factory.annotation.Autowired;

import com.openhome.entity.Property;
import com.openhome.entity.User;
import com.openhome.service.PropertyRepositoryService;
import com.openhome.service.UserRepositoryService;

public class PropertyControllerTest {

	Property property;
	User user;
	
	@Autowired private MockMvc mockMvc;
	@InjectMocks PropertyController propertyController;
	@Mock UserController userController;
	@Mock PropertyRepositoryService propertyRepoService;
	@Mock UserRepositoryService userRepoService;
	
	@Before
	public void setup() {
		MockitoAnnotations.initMocks(this);
		mockMvc = MockMvcBuilders.standaloneSetup(propertyController).build();
		
		property = new Property();
		property.setId(999);
		property.setCity("Las Vegas");
		property.setState("NV");
		property.setPropertyType("condo");
		property.setStreetAddress("101 Flora Vista street");
		property.setZipcode(98221);
		property.setDescription("This is a wonderful property");
		property.setWeekdayPrice(200.99);
		property.setWeekendPrice(249.99);
		property.setTotalBedrooms(6);
		property.setInternet(true);
		property.setParking(false);
		property.setUserId(111);
		
		user = new User();
		user.setId(111);
		user.setEmail("tom_swayer@gmail.com");
		user.setFirstName("Tom");
		user.setLastName("Swayer");
		user.setIsVerified(true);
		user.setType("host");
		user.setPassword("1234");
	}
	
	@Test
	public void testPostProperty() throws Exception {
		
		when(propertyRepoService.createProperty(any(Property.class))).thenReturn(property);
		when(userRepoService.getUserById(anyLong())).thenReturn(user);
		
		Mockito.doNothing().when(userController).sendNotification(any(User.class), anyString(), anyString());
		
		long phoneNo = 7654329876L;
		
		JSONObject requestBody = new JSONObject();
		requestBody.put("streetAddress", "101 Flora Vista stree");
		requestBody.put("city", "Las Vegas");
		requestBody.put("state", "NV");
		requestBody.put("zipcode", 98221);
		requestBody.put("sharingType", "Entire Place");
		requestBody.put("propertyType", "condo");
		requestBody.put("totalBedrooms", 6);
		requestBody.put("totalSquareFootage", 1500);
		requestBody.put("roomSquareFootage", 300);
		requestBody.put("privateBathroom", true);
		requestBody.put("privateShower", true);
		requestBody.put("weekdayPrice", "200.99");
		requestBody.put("weekendPrice", "249.99");
		requestBody.put("phoneNumber", phoneNo);
		requestBody.put("description", "This is a wonderful property");
		requestBody.put("parking", false);
		requestBody.put("dailyParkingFee", "0.00");
		requestBody.put("internet", true);
		requestBody.put("userId", 111);
		requestBody.put("monday", -1);
		requestBody.put("tuesday", -1);
		requestBody.put("wednesday", -1);
		requestBody.put("thursday", -1);
		requestBody.put("friday", -1);
		requestBody.put("saturday", 7);
		requestBody.put("sunday", -1);
		String reqBody = requestBody.toString();
		
		mockMvc.perform(MockMvcRequestBuilders
				.post("/postProperty")
				.content(reqBody)
				.contentType("application/JSON")
		   	    .accept("application/json"))
				.andDo(MockMvcResultHandlers.print())
				.andExpect(MockMvcResultMatchers.status().isOk())
				.andExpect(MockMvcResultMatchers.jsonPath("$.propertyDetails").exists())
				.andExpect(MockMvcResultMatchers.jsonPath("$.propertyDetails.city").exists())
				.andExpect(MockMvcResultMatchers.jsonPath("$.propertyDetails.city", CoreMatchers.is(property.getCity())))
				.andExpect(MockMvcResultMatchers.jsonPath("$.propertyDetails.state", CoreMatchers.is(property.getState())))
				.andExpect(MockMvcResultMatchers.jsonPath("$.propertyDetails.zipcode", CoreMatchers.is(property.getZipcode())))
				.andExpect(MockMvcResultMatchers.jsonPath("$.propertyDetails.propertyType", CoreMatchers.is(property.getPropertyType())))
				.andExpect(MockMvcResultMatchers.jsonPath("$.propertyDetails.parking", CoreMatchers.is(property.isParking())))
				.andExpect(MockMvcResultMatchers.jsonPath("$.propertyDetails.internet", CoreMatchers.is(property.isInternet())));
	}
	
	@Test
	public void testGetProperty() throws Exception {
		
		when(propertyRepoService.findPropertyById(anyLong())).thenReturn(property);
		
		mockMvc.perform(MockMvcRequestBuilders
				.get("/getProperty/{propertyId}", new Long(999)))
				.andDo(MockMvcResultHandlers.print())
				.andExpect(MockMvcResultMatchers.status().isOk())
				.andExpect(MockMvcResultMatchers.jsonPath("$.propertyDetails").exists());
	}
	
	@Test
	public void testGetAllProperties() throws Exception {
		
		ArrayList<Property> properties = new ArrayList<>();
		properties.add(property);
		
		when(propertyRepoService.findAllProperties(anyLong())).thenReturn(properties);
		
		mockMvc.perform(MockMvcRequestBuilders
				.get("/getAllProperties/{hostId}", new Long(111)))
				.andDo(MockMvcResultHandlers.print())
				.andExpect(MockMvcResultMatchers.status().isOk())
				.andExpect(MockMvcResultMatchers.jsonPath("$.propertyDetails").exists())
				.andExpect(MockMvcResultMatchers.jsonPath("$.propertyDetails").isNotEmpty())
				.andExpect(MockMvcResultMatchers.jsonPath("$.propertyDetails[0].city", CoreMatchers.is(property.getCity())))
				.andExpect(MockMvcResultMatchers.jsonPath("$.propertyDetails[0].state", CoreMatchers.is(property.getState())))
				.andExpect(MockMvcResultMatchers.jsonPath("$.propertyDetails[0].description", CoreMatchers.is(property.getDescription())));
	}
	
	@Test
	public void testUpdatePropertyPrice() throws Exception {
		
		when(propertyRepoService.findPropertyById(999)).thenReturn(property);
		when(userRepoService.getUserById(anyLong())).thenReturn(user);
		
		JSONObject requestBody = new JSONObject();
		requestBody.put("weekdayPrice", "215.99");
		requestBody.put("weekendPrice", "249.99");
		String reqBody = requestBody.toString();
		
		property.setWeekdayPrice(requestBody.getDouble("weekdayPrice"));
		property.setWeekendPrice(requestBody.getDouble("weekendPrice"));
		
		when(propertyRepoService.updateProperty(any(Property.class))).thenReturn(property);
		Mockito.doNothing().when(userController).sendNotification(any(User.class), anyString(), anyString());
		
		mockMvc.perform(MockMvcRequestBuilders
				.put("/updatePropertyPrice/{propertyId}", new Long(999))
				.content(reqBody)
				.contentType("application/JSON")
		   	    .accept("application/json"))
				.andDo(MockMvcResultHandlers.print())
				.andExpect(MockMvcResultMatchers.status().isOk())
				.andExpect(MockMvcResultMatchers.jsonPath("$.propertyDetails").exists())
				.andExpect(MockMvcResultMatchers.jsonPath("$.propertyDetails.weekdayPrice").exists())
				.andExpect(MockMvcResultMatchers.jsonPath("$.propertyDetails.weekendPrice").exists())
				.andExpect(MockMvcResultMatchers.jsonPath("$.propertyDetails.weekdayPrice", CoreMatchers.is(requestBody.getDouble("weekdayPrice"))))
				.andExpect(MockMvcResultMatchers.jsonPath("$.propertyDetails.weekendPrice", CoreMatchers.is(requestBody.getDouble("weekendPrice"))));
	}
	
	@Test
	public void testGetProperties() throws Exception {
		
		ArrayList<Property> properties = new ArrayList<>();
		properties.add(property);
		
		when(propertyRepoService.findPropertyById(anyLong())).thenReturn(property);
		when(propertyRepoService.findProperties(any(Map.class))).thenReturn(properties);
		
		mockMvc.perform(MockMvcRequestBuilders
				.get("/getProperties/search?city=Las Vegas&startDate=2019-12-25&endDate=2019-12-27")
		   	    .accept("application/json"))
				.andDo(MockMvcResultHandlers.print())
				.andExpect(MockMvcResultMatchers.status().isOk())
				.andExpect(MockMvcResultMatchers.jsonPath("$.propertyDetails").exists())
				.andExpect(MockMvcResultMatchers.jsonPath("$.propertyDetails").isNotEmpty())
				.andExpect(MockMvcResultMatchers.jsonPath("$.propertyDetails[0].streetAddress").exists())
				.andExpect(MockMvcResultMatchers.jsonPath("$.propertyDetails[0].city", CoreMatchers.is(property.getCity())))
				.andExpect(MockMvcResultMatchers.jsonPath("$.propertyDetails[0].state", CoreMatchers.is(property.getState())))
				.andExpect(MockMvcResultMatchers.jsonPath("$.propertyDetails[0].propertyType", CoreMatchers.is(property.getPropertyType())));
		
	}

	
	
	
	
}
