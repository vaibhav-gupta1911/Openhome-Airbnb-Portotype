package com.openhome.controller;

import static org.mockito.Mockito.when;

import java.util.HashMap;
import java.util.Map;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.hamcrest.CoreMatchers;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import org.springframework.beans.factory.annotation.Autowired;

import com.openhome.entity.User;
import com.openhome.service.UserRepositoryService;

public class UserControllerTest {
	
	User user1;
	User user2;
	
	@Autowired private MockMvc mockMvc;
	@InjectMocks UserController userController;
	@Mock UserRepositoryService userRepoService;
	
	@Before
	public void setup() {
		MockitoAnnotations.initMocks(this);
		mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
		
		user1 = new User();
		user1.setId(1);
		user1.setEmail("bob_builder@gmail.com");
		user1.setFirstName("Bob");
		user1.setLastName("Builder");
		user1.setIsVerified(true);
		user1.setType("host");
		user1.setPassword("1234");
		
		user2 = new User();
		user2.setId(2);
		user2.setEmail("winnie_pooh@gmail.com");
		user2.setFirstName("Winnie");
		user2.setLastName("Pooh");
		user2.setType("guest");
		user2.setIsVerified(true);
		user2.setPassword("1234");
	}

	@Test
	public void testAddNewUser() throws Exception {
		
		when(userRepoService.createUser(any(User.class))).thenReturn(user1);
	    
		JSONObject requestBody = new JSONObject();
		requestBody.put("firstName", "Bob");
		requestBody.put("lastName", "Builder");
		requestBody.put("email", "bob_builder@gmail.com");
		requestBody.put("password", "1234");
		String reqBody = requestBody.toString();
		
		mockMvc.perform(MockMvcRequestBuilders
				.post("/register")
				.content(reqBody)
				.contentType("application/JSON")
		   	    .accept("application/json"))
				.andDo(MockMvcResultHandlers.print())
				.andExpect(MockMvcResultMatchers.status().isOk())
				.andExpect(MockMvcResultMatchers.jsonPath("$.userDetails").exists())
				.andExpect(MockMvcResultMatchers.jsonPath("$.userDetails.firstName").exists())
				.andExpect(MockMvcResultMatchers.jsonPath("$.userDetails.lastName").exists())
				.andExpect(MockMvcResultMatchers.jsonPath("$.userDetails.firstName", CoreMatchers.is(user1.getFirstName())))
				.andExpect(MockMvcResultMatchers.jsonPath("$.userDetails.lastName", CoreMatchers.is(user1.getLastName())))
				.andExpect(MockMvcResultMatchers.jsonPath("$.userDetails.email", CoreMatchers.is("bob_builder@gmail.com")))
				.andExpect(MockMvcResultMatchers.jsonPath("$.userDetails.password", CoreMatchers.is("1234")));
	}
	
	@Test
	public void testGetUser() throws Exception {
		
		when(userRepoService.findUserByEmail(anyString())).thenReturn(user2);
		
		Map<Object, Object> responseBody = userController.getUser(null, null, user2.getEmail());
		
		assertNotNull(responseBody);
		Map<Object, Object> responseUser = (Map<Object, Object>) responseBody.get("userDetails");
		assertNotNull(responseUser);
		assertEquals(responseUser.get("id"), user2.getId());
		assertEquals(responseUser.get("firstName"), user2.getFirstName());
		assertEquals(responseUser.get("lastName"), user2.getLastName());
		assertEquals(responseUser.get("type"), user2.getType());
		assertEquals(responseUser.get("isVerified"), user2.getIsVerified());
		
	}
	
	@Test
	public void testSignInUser() throws Exception {
		
		when(userRepoService.signIn(anyString(), anyString())).thenReturn(user1);
		
		JSONObject requestBody = new JSONObject();
		requestBody.put("email", "bob_builder@gmail.com");
		requestBody.put("password", "1234");
		String reqBody = requestBody.toString();
		
		mockMvc.perform(MockMvcRequestBuilders
				.post("/signIn")
				.content(reqBody)
				.contentType("application/JSON")
		   	    .accept("application/json"))
				.andDo(MockMvcResultHandlers.print())
				.andExpect(MockMvcResultMatchers.status().isOk())
				.andExpect(MockMvcResultMatchers.jsonPath("$.userDetails").exists())
				.andExpect(MockMvcResultMatchers.jsonPath("$.userDetails.firstName", CoreMatchers.is(user1.getFirstName())))
				.andExpect(MockMvcResultMatchers.jsonPath("$.userDetails.lastName", CoreMatchers.is(user1.getLastName())))
				.andExpect(MockMvcResultMatchers.jsonPath("$.userDetails.email", CoreMatchers.is("bob_builder@gmail.com")));
	}
}











