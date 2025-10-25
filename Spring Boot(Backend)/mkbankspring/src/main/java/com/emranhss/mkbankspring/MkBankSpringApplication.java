package com.emranhss.mkbankspring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MkBankSpringApplication {

	public static void main(String[] args) {
		SpringApplication.run(MkBankSpringApplication.class, args);
	}

}
