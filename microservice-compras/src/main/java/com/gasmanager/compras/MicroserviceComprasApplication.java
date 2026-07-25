package com.gasmanager.compras;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
@EnableDiscoveryClient
public class MicroserviceComprasApplication {

	public static void main(String[] args) {
		SpringApplication.run(MicroserviceComprasApplication.class, args);
	}

}
