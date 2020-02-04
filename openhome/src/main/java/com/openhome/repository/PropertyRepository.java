package com.openhome.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.openhome.entity.Property;

public interface PropertyRepository extends JpaRepository<Property, Long> {

}
