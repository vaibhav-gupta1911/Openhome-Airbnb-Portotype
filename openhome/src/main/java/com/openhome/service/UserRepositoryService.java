package com.openhome.service;

import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.openhome.entity.User;
import com.openhome.entity.Verification;
import com.openhome.repository.UserRepository;
import com.openhome.repository.VerificationRepository;

@Service
public class UserRepositoryService {

	@Autowired
	UserRepository userRepository;

	@Autowired
	VerificationRepository verificationRepository;

	@Autowired
	EntityManager entityManager;

	public User createUser(User user) {
		User user2 = userRepository.save(user);
		System.out.println(
				"\n - - - - - - - - - - User " + user.getFirstName() + " added successfully! - - - - - - - - - - -\n");
		return user2;
	}

	public User getUserById(long userId) {
		User user = userRepository.getOne(userId);
		return user;
	}

	public User updateUser(User user) {

		User user2 = userRepository.save(user);
		System.out.println("\n - - - - - - - - - - User " + user.getFirstName()
				+ " updated successfully! - - - - - - - - - - -\n");
		return user2;
	}

	public User findUserByEmail(String email) {

		Query query = entityManager.createQuery("SELECT u FROM User u WHERE u.email = :email");
		query.setParameter("email", email);
		System.out.println("Before Query:"+query);
		User user=null;
		try {
			user = (User) query.getSingleResult();
		} catch(Exception e) {
			System.out.println(" exception thrown is : "+ e);	
		}
		return user;
	}
	
	public User signIn(String email,String password) {
		System.out.println("=== email"+email+"  password"+password);
		
		Query query = entityManager.createQuery("FROM User WHERE email = :email AND password = :password");
		query.setParameter("email", email);
		query.setParameter("password", password);
		User user = null;
		try {
			user = (User) query.getSingleResult();
		}catch(NoResultException e) {
			System.out.println("exception thrown is :===  "+e);
			System.out.println(" No user found with email : "+ email + " password "+password);
		}
		
		return user;
	}
	

	public void sendVerification(User user, Verification verification) {
		final String username = "openhome275@gmail.com";
		final String password = "openhome123";
//		final String username = "openhackservice@gmail.com";
//		final String password = "openhack123";

		Properties prop = new Properties();
		prop.put("mail.smtp.host", "smtp.gmail.com");
		prop.put("mail.smtp.port", "587");
		prop.put("mail.smtp.auth", "true");
		prop.put("mail.smtp.starttls.enable", "true"); // TLS

		Session session = Session.getInstance(prop, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(username, password);
			}
		});

		try {

			String link = "http://34.233.196.232:8080/verifyRegistration?token=" + verification.getToken();
			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress(username));
			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(user.getEmail()));
			message.setSubject("Verify Your Account");

			message.setContent("<p>Hi " + user.getFirstName() + " " + user.getLastName()
					+ "!<br/><br/>OpenHome team welcomes you to miniAirBnb! Thank you for registrating on OpenHome. Please verify your account by clicking on this link : <a href='"
					+ link + "'>Click to Verify</a><p><br/><br/>Regeards,<br/>OpenHome Team.", "text/html");

			Transport.send(message);

			System.out.println("Done");

		} catch (MessagingException e) {
			e.printStackTrace();
		}
		verificationRepository.save(verification);
	}

}
