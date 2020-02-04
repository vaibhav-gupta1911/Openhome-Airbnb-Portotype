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
import javax.persistence.Query;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.openhome.entity.User;
import com.openhome.entity.Verification;
import com.openhome.repository.UserRepository;
import com.openhome.repository.VerificationRepository;

@Service
public class VerificationRepositoryService {

	@Autowired
	VerificationRepository verificationRepository;

	@Autowired
	EntityManager entityManager;

	public Verification getUserByToken(String token) {
		Query query = entityManager.createQuery("SELECT v FROM Verification v WHERE v.token = :token");
		query.setParameter("token", token);
		Verification verification = (Verification) query.getSingleResult();

		return verification;
	}


}
