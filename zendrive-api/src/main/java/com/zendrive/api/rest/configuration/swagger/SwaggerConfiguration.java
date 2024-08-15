package com.zendrive.api.rest.configuration.swagger;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
  info = @Info(
    title = "${configuration.swagger.app}",
    version = "${configuration.swagger.version}",
    description = "${configuration.swagger.description}",
    contact = @Contact(name = "${configuration.swagger.developer}", email = "${configuration.swagger.email}")
  ),
  servers = {
    @Server(url = "/", description = "Default Server URL")
  }
)

public class SwaggerConfiguration { }