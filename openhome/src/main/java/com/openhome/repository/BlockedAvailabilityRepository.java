package com.openhome.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.openhome.entity.BlockedAvailability;

public interface BlockedAvailabilityRepository  extends JpaRepository<BlockedAvailability, Long> {

}
