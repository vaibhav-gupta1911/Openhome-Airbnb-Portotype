package com.openhome.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.openhome.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

}
