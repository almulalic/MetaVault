package com.zendrive.api.rest.models.dto.token;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO class representing a request to generate a token.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GenerateTokenRequest {

	/**
	 * The email of the user.
	 */
	private String email;

	/**
	 * The password of the user.
	 */
	private String password;

	/**
	 * Indicates whether to remember the user.
	 */
	private boolean rememberMe;
}
