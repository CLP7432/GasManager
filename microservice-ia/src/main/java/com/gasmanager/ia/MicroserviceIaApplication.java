package com.gasmanager.ia;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class MicroserviceIaApplication {

	public static void main(String[] args) {
		SpringApplication.run(MicroserviceIaApplication.class, args);
	}

}
