package com.zendrive.api.rest.models.dto.token;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO class representing a request to refresh a token.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RefreshTokenRequest {

	/**
	 * The refresh token to be used for refreshing.
	 */
	@NotBlank
	private String refreshToken;
}
