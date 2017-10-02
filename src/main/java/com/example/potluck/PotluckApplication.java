package com.example.potluck;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import io.swagger.annotations.Api;
import io.swagger.annotations.SwaggerDefinition;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;


@SpringBootApplication
@EnableAutoConfiguration
@SwaggerDefinition
//@EnableSwagger //Enable swagger 1.2 spec
//@EnableSwagger2 //Enable swagger 2.0 spec
public class PotluckApplication {

	public static void main(String[] args) {
		SpringApplication.run(PotluckApplication.class, args);
	}
	
	/*@Bean
	   public Docket api() {
	       return new Docket(DocumentationType.SWAGGER_2).select()
	               .apis(RequestHandlerSelectors.withClassAnnotation(Api.class))
	               .paths(PathSelectors.any()).build().pathMapping("/")
	               .apiInfo(apiInfo()).useDefaultResponseMessages(false);
	   }

	   @Bean
	   ApiInfo apiInfo() {
	       final ApiInfoBuilder builder = new ApiInfoBuilder();
	       builder.title("BlazeMeter Spring Boot API").version("1.0").license("(C) Copyright BlazeMeter")
	               .description("List of all endpoints used in API");
	       return builder.build();
	   }*/
	
	
	
}
