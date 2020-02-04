package com.openhome.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.openhome.entity.Availability;

public interface AvailabilityRepository extends JpaRepository<Availability, Long> {

}
