package com.zendrive.api.rest.configuration.security;

import com.zendrive.api.core.service.user.UserService;
import com.zendrive.api.rest.filter.JwtAuthenticationFilter;
import com.zendrive.api.rest.filter.slf4j.Slf4jMdcRequestIdFilter;
import com.zendrive.api.rest.filter.slf4j.Slf4jMdcUserIdFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.CommonsRequestLoggingFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {
	private final Slf4jMdcRequestIdFilter slf4jMdcRequestIdFilter;
	private final Slf4jMdcUserIdFilter slf4jMdcUserIdFilter;
	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final UserService userService;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http
						 .cors(Customizer.withDefaults())
						 .authorizeHttpRequests(request -> request
																								 .requestMatchers("/v1/auth/**")
																								 .permitAll()
																								 .requestMatchers("/error")
																								 .permitAll()
																								 .requestMatchers("/v1/auth/token/validate")
																								 .authenticated()
																								 .anyRequest()
																								 .authenticated()
						 )
						 .csrf(AbstractHttpConfigurer::disable)
						 .sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
						 .authenticationProvider(authenticationProvider())
						 .addFilterAfter(requestLoggingFilter(), UsernamePasswordAuthenticationFilter.class)
						 .addFilterAfter(slf4jMdcUserIdFilter, UsernamePasswordAuthenticationFilter.class)
						 .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
						 .addFilterBefore(slf4jMdcRequestIdFilter, JwtAuthenticationFilter.class)
						 .build();
	}

	@Bean
	public CommonsRequestLoggingFilter requestLoggingFilter() {
		CommonsRequestLoggingFilter loggingFilter = new CommonsRequestLoggingFilter();
		loggingFilter.setIncludeClientInfo(true);
		loggingFilter.setIncludeQueryString(true);
		loggingFilter.setIncludePayload(true);
		loggingFilter.setMaxPayloadLength(64000);
		return loggingFilter;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
		authProvider.setUserDetailsService(userService.userDetailsService());
		authProvider.setPasswordEncoder(passwordEncoder());
		return authProvider;
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
		throws Exception {
		return config.getAuthenticationManager();
	}
}