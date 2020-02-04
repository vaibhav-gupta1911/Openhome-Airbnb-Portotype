package com.openhome.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.openhome.entity.CustomSystemTime;

public interface CustomSystemTimeRepository extends JpaRepository<CustomSystemTime, Long> {

}


