package com.openhome.controller;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.text.SimpleDateFormat;
import java.util.Properties;
import java.util.UUID;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;


import com.openhome.entity.User;
import com.openhome.entity.Verification;
import com.openhome.service.UserRepositoryService;
import com.openhome.service.VerificationRepositoryService;

@RestController
public class UserVerification {

	@Autowired
	private UserRepositoryService userService;
	
	@Autowired
	private VerificationRepositoryService verificationService;
	
//	public static final long HOUR = 3600*1000;
//	
//	@PostMapping("/sendVerification")
////	@RequestMapping(path="/verify", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
//    public @ResponseBody String sendVerificationToken (@RequestBody HashMap<String, Long> map){
//        
//		User user = userService.getUserById(map.get("userId"));
//
//		// get all properties
//		String email = user.getEmail();
//		String token = UUID.randomUUID().toString();
//		Date createdDate = new Date();
//		Date expiryDate = new Date(createdDate.getTime()+ 24*HOUR);
//		Verification verification  = new Verification();
//		
//		// set all properties of verification
//		verification.setUserId(map.get("userId"));
//		verification.setToken(token);
//		verification.setCreatedDate(createdDate);
//		verification.setExpiryDate(expiryDate);
//		
//		System.out.println("trying to send email to : "+email);
//		userService.sendVerification(user, verification);
//        
//        return "Verification Email Sent";
//    }
	
	
	@GetMapping("/verifyRegistration")
    public @ResponseBody void verifyRegistration (HttpServletResponse response,@RequestParam("token") String token){
        
		Verification verification = verificationService.getUserByToken(token);
		
		User user = userService.getUserById(verification.getUserId());
		Date expiryDate = verification.getExpiryDate();
		Date currentDate = new Date(); 
		if(user.getIsVerified() || expiryDate.compareTo(currentDate)<=0) {
			try {
				response.sendRedirect("http://34.230.8.86:3000/signIn");
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
//			return "Link expired or Already verified!";
		else {
			user.setIsVerified(true);
			userService.updateUser(user);
			
			try {
				response.sendRedirect("http://localhost:3000/home");
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
//			return "redirect:/localhost:3000/home";
		}
	return;
//        return "User Verified";
    }
	
	
	/*
	 * @RequestMapping(path="/verify", method = RequestMethod.POST, consumes =
	 * MediaType.APPLICATION_JSON_VALUE) public @ResponseBody String addNewUser
	 * (@RequestBody User user){
	 * 
	 * String email = user.getEmail(); sendEmail(user);
	 * 
	 * System.out.println("trying to send email to : "+email);
	 * 
	 * return "Email Sent"; }
	 * 
	 * public void sendEmail(User user){ final String username =
	 * "openhome275@gmail.com"; final String password = "openhome123";
	 * 
	 * Properties prop = new Properties(); prop.put("mail.smtp.host",
	 * "smtp.gmail.com"); prop.put("mail.smtp.port", "587");
	 * prop.put("mail.smtp.auth", "true"); prop.put("mail.smtp.starttls.enable",
	 * "true"); //TLS
	 * 
	 * Session session = Session.getInstance(prop, new javax.mail.Authenticator() {
	 * protected PasswordAuthentication getPasswordAuthentication() { return new
	 * PasswordAuthentication(username, password); } });
	 * 
	 * try {
	 * 
	 * Message message = new MimeMessage(session); message.setFrom(new
	 * InternetAddress(username)); message.setRecipients( Message.RecipientType.TO,
	 * InternetAddress.parse(user.getEmail()) );
	 * message.setSubject("Verify Your Account");
	 * message.setText("Hi!\nOpenHome team welcomes you to miniAirBnb!");
	 * 
	 * Transport.send(message);
	 * 
	 * System.out.println("Done");
	 * 
	 * } catch (MessagingException e) { e.printStackTrace(); } }
	 */
}
