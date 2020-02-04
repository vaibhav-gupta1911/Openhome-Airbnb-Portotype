package com.openhome.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.openhome.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

}
