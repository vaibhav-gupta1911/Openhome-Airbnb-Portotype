package com.openhome.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import com.openhome.entity.Hotel;

public interface HotelRepository extends JpaRepository<Hotel, Long> {

}

//public interface HotelRepository extends CrudRepository<Hotel, Long>, IHotelRepositoryCustom {
//
//
//}