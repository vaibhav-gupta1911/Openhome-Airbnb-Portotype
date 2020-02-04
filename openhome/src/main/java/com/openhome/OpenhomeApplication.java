package com.openhome;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableJpaRepositories(basePackages="com.openhome.repository") // for enabling the JPA repositories as Beans and manipulating the database.
@SpringBootApplication
@EnableScheduling
public class OpenhomeApplication {

	public static void main(String[] args) {
		SpringApplication.run(OpenhomeApplication.class, args);
	}

}
