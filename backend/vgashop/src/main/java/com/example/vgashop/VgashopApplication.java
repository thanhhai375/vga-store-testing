package com.example.vgashop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class VgashopApplication {

	public static void main(String[] args) {
		SpringApplication.run(VgashopApplication.class, args);
	}

}
