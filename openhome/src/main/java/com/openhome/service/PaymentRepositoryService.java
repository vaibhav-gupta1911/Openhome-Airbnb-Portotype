package com.openhome.service;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.openhome.entity.Card;
import com.openhome.entity.Payment;
import com.openhome.entity.User;
import com.openhome.repository.BookingRepository;
import com.openhome.repository.CardRepository;
import com.openhome.repository.PaymentRepository;
import com.openhome.repository.UserRepository;
import com.openhome.repository.VerificationRepository;

@Service
public class PaymentRepositoryService {

	@Autowired
	PaymentRepository paymentRepository;

	@Autowired
	CardRepository cardRepository;

	@Autowired
	BookingRepository bookingrepo;

	@Autowired
	EntityManager entityManager;

	@Transactional
	public Payment makePaymentonCancelltion(Payment p) {
		Payment pay = paymentRepository.save(p);
		return pay;
	}

	@Transactional
	public Payment makePayment(Payment p) {
		Payment pay = paymentRepository.save(p);

		long bid = p.getBookingid();
		Query querybid = entityManager.createQuery("UPDATE Booking SET status = 'paid' WHERE id = :id");
		querybid.setParameter("id", bid);

		querybid.executeUpdate();

		System.out.println("cardddddddddddddd" + p.isSaveCard());
		if (p.isSaveCard()) {
			Card c = new Card();
			c.setCardNo(p.getCardNo());
			c.setExpiryMonth(p.getExpiryMonth());
			c.setExpiryYear(p.getExpiryYear());
			c.setUserName(p.getUserName());
			c.setSaveCard(p.isSaveCard());
			c.setOwner(p.getOwner());
			c.setEmail(p.getEmail());
			c.setCvv(p.getCvv());

			long owner = p.getOwner();
			Query query = entityManager.createQuery("SELECT u FROM Card u WHERE u.owner = :owner");
			query.setParameter("owner", owner);

			if (query.getResultList().size() > 0)
				deletecard((Card) query.getResultList().get(0));

			Card card = cardRepository.save(c);
		}

//		System.out.println(
//				"\n - - - - - - - - - - User " + payment.() + " added successfully! - - - - - - - - - - -\n");
		return pay;
	}

	public Card addcard(Card c) {

		long owner = c.getOwner();
		Query query = entityManager.createQuery("SELECT u FROM Card u WHERE u.owner = :owner");
		query.setParameter("owner", owner);

		if (query.getResultList().size() > 0)
			deletecard((Card) query.getResultList().get(0));

		Card card = cardRepository.save(c);
		System.out.println("Card Addded");

		return card;
	}

	public String deletecard(Card c) {
		cardRepository.delete(c);
		System.out.println("Card Deleted");

		return "Card Deleted";
	}

	public Card findCardsByUser(long user) {
		System.out.println("user in findCardsByUser ");
		System.out.println(user);
		long id = user;
		Query query = entityManager.createQuery("SELECT u FROM Card u where owner=:id ");
		query.setParameter("id", id);
		System.out.println("Before Query:" + query);
		Card card = null;
		try {
			card = (Card) query.getResultList().get(0);
			System.out.println(card.getCardNo());
		} catch (NoResultException e) {
			return card;
		}

		return card;
	}

	public List<Object> gethostBillingSummary(long userid) {

		Query query = entityManager.createQuery(
				"SELECT py.bookingid, py.amount, py.entryDate, py.id, py.propertyid, pr.description, pr.city,pr.state, pr.streetAddress, py.reason FROM Payment py LEFT JOIN Property pr ON pr.id = py.propertyid WHERE py.owner = :userid");
		query.setParameter("userid", userid);

		return query.getResultList();
	}

	public List<Object> getguestBillingSummary(long guestid) {

		Query query = entityManager.createQuery(
				"SELECT py.bookingid, py.amount, py.entryDate, py.id, py.propertyid, pr.description, pr.city,pr.state, pr.streetAddress, py.reason FROM Payment py LEFT JOIN Property pr ON pr.id = py.propertyid JOIN Booking b ON b.id = py.bookingid WHERE py.owner = :guestid");
		query.setParameter("guestid", guestid);

		return query.getResultList();
	}
}
