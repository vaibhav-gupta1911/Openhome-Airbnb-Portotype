package com.openhome.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.openhome.entity.User;


public interface UserRepository extends JpaRepository<User, Long>{

}

