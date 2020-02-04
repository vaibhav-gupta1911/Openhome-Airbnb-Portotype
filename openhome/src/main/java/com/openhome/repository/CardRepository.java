package com.openhome.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.openhome.entity.Card;

public interface CardRepository extends JpaRepository<Card, Long> {

}
