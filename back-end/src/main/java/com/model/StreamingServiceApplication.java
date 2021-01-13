package com.model;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import static org.springframework.boot.SpringApplication.*;

@SpringBootApplication
@EnableSwagger2
public class StreamingServiceApplication {
	public static void main(String[] args) {
		run(StreamingServiceApplication.class, args);
	}

}
